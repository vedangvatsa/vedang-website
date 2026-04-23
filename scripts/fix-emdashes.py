#!/usr/bin/env python3
"""Replace em-dashes with proper alternatives:
- Paired em-dashes (parenthetical) → commas or parentheses 
- Single em-dashes (before explanation) → period + capitalize, or comma
"""
import re
import sys
import os

def fix_emdashes(text):
    lines = text.split('\n')
    result = []
    
    for line in lines:
        # Skip frontmatter, component lines, URLs, code blocks
        if line.startswith('---') or line.startswith('<') or line.startswith('```') or line.startswith('import'):
            result.append(line)
            continue
            
        # Count em-dashes in this line
        dash_count = line.count(' — ')
        
        if dash_count == 0:
            result.append(line)
            continue
        
        if dash_count >= 2:
            # Paired em-dashes: replace with commas (parenthetical usage)
            # Find pairs and replace them
            # Strategy: replace pairs from left to right
            parts = line.split(' — ')
            if len(parts) >= 3:
                # Reconstruct with commas for pairs
                new_line = parts[0]
                i = 1
                while i < len(parts):
                    if i + 1 < len(parts) and i % 2 == 1:
                        # This is a parenthetical clause
                        new_line += ', ' + parts[i] + ', ' + parts[i+1]
                        i += 2
                    else:
                        # Odd one out - treat as single dash
                        next_part = parts[i].strip()
                        if next_part and next_part[0].islower():
                            new_line += '. ' + next_part[0].upper() + next_part[1:]
                        else:
                            new_line += '. ' + next_part
                        i += 1
                line = new_line
            else:
                line = line.replace(' — ', ', ', 1)
        elif dash_count == 1:
            # Single em-dash: context-dependent replacement
            parts = line.split(' — ', 1)
            before = parts[0]
            after = parts[1]
            
            # Check if after starts with lowercase (continuation/explanation)
            if after and after[0].islower():
                # Check if it's a short parenthetical that ends the sentence
                # or if it's an explanation
                if len(after) < 80 and ('.' not in after or after.endswith('.')):
                    # Short continuation - use comma
                    line = before + ', ' + after
                else:
                    # Longer explanation - use period + capitalize
                    line = before + '. ' + after[0].upper() + after[1:]
            elif after and after[0].isupper():
                # Already capitalized - likely a new thought
                line = before + '. ' + after
            else:
                line = before + '. ' + after
        
        result.append(line)
    
    return '\n'.join(result)


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if ' — ' not in content:
        return False
    
    fixed = fix_emdashes(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed)
    
    return True


if __name__ == '__main__':
    essays_dir = '/Users/vedang/vedang-website/src/content/essays'
    count = 0
    for fname in sorted(os.listdir(essays_dir)):
        if fname.endswith('.mdx'):
            fpath = os.path.join(essays_dir, fname)
            if process_file(fpath):
                count += 1
                print(f'Fixed: {fname}')
    print(f'\nDone. {count} files updated.')
