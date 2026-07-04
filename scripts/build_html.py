import re, os

img_dir = '/Users/vedang/ZCodeProject/vedang-website/scripts/post-images'

mapping = {}
with open('/Users/vedang/ZCodeProject/vedang-website/scripts/post_mapping.txt') as f:
    for line in f:
        cur, orig = line.strip().split(',')
        mapping[int(cur)] = int(orig)

with open('/Users/vedang/ZCodeProject/vedang-website/scripts/linkedin-viral-rewrites-draft.md', 'r') as f:
    lines = f.readlines()

out_lines = []
current_post_num = None
for line in lines:
    pm = re.match(r'^## Post (\d+)', line.strip())
    if pm:
        current_post_num = int(pm.group(1))

    m = re.match(r'^!\[\]\((.+)\)$', line.strip())
    if m:
        orig_num = mapping.get(current_post_num)
        if orig_num:
            local_imgs = sorted([f for f in os.listdir(img_dir) if f.startswith(f'post_{orig_num}_') and f.endswith('.jpg')])
            if local_imgs:
                out_lines.append(f'<img src="post-images/{local_imgs[0]}" style="max-width:100%;margin:8px 0;border-radius:8px;" />\n')
            else:
                out_lines.append('<p><em>(no image available)</em></p>\n')
        else:
            out_lines.append('<p><em>(no image available)</em></p>\n')
    else:
        out_lines.append(line)

content = ''.join(out_lines)

# Simple markdown to HTML
content = content.replace('<img ', '<IMG ')  # protect img tags

# Headers
content = re.sub(r'^# (.+)$', r'<h1>\1</h1>', content, flags=re.M)
content = re.sub(r'^## (.+)$', r'<h2>\1</h2>', content, flags=re.M)
content = re.sub(r'^---$', r'<hr>', content, flags=re.M)

# Bold
content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content)

# Restore img tags
content = content.replace('<IMG ', '<img ')

# Wrap text lines in <p>
lines2 = content.split('\n')
html_lines = []
in_p = False
for line in lines2:
    s = line.strip()
    if s.startswith('<h1>') or s.startswith('<h2>') or s.startswith('<hr>') or s.startswith('<img ') or s.startswith('<p>'):
        if in_p:
            html_lines.append('</p>')
            in_p = False
        html_lines.append(s)
    elif s == '':
        if in_p:
            html_lines.append('</p>')
            in_p = False
        html_lines.append('')
    else:
        if not in_p:
            html_lines.append('<p>')
            in_p = True
        html_lines.append(s + ' ')

if in_p:
    html_lines.append('</p>')

body = '\n'.join(html_lines)

html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>LinkedIn Viral Post Rewrites</title>
<style>
body {{ font-family: -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #333; line-height: 1.6; }}
h1 {{ font-size: 28px; border-bottom: 2px solid #eee; padding-bottom: 10px; }}
h2 {{ font-size: 20px; color: #0077b5; margin-top: 30px; }}
hr {{ border: none; border-top: 1px solid #eee; margin: 30px 0; }}
p {{ margin: 12px 0; }}
strong {{ color: #222; }}
img {{ display: block; max-width: 100%; }}
</style>
</head>
<body>
{body}
</body>
</html>'''

with open('/Users/vedang/ZCodeProject/vedang-website/scripts/linkedin-viral-rewrites-draft.html', 'w') as f:
    f.write(html)

print('Done. HTML created with local images.')
