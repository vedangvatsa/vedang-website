import fs from 'fs';
import path from 'path';

export interface SlopViolation {
  file: string;
  line: number;
  type: string;
  match: string;
  context: string;
  suggestion: string;
}

export interface RuleDefinition {
  name: string;
  pattern: RegExp;
  description: string;
  suggestion: string;
  category: 'Tier 1 Banned' | 'Tier 2 Buzzword' | 'Tier 3 Pattern' | 'Conversational Trope' | 'Formatting';
}

export const SLOP_RULES: RuleDefinition[] = [
  // Tier 1: Absolute Banned Words & Phrases
  { name: 'explore', pattern: /\b(explore|explores|exploring|exploration|explore into)\b/i, description: '#1 AI tell word in prose', suggestion: 'Use "examine," "analyze," "study," or state directly.', category: 'Tier 1 Banned' },
  { name: 'landscape', pattern: /\blandscape\b/i, description: 'Vague AI filler word', suggestion: 'Use "market," "field," "industry," or name specifically.', category: 'Tier 1 Banned' },
  { name: 'reshape', pattern: /\b(reshape|reshapes|reshaping)\b/i, description: 'AI transformation cliché', suggestion: 'Use "alter," "change," or describe specific impact.', category: 'Tier 1 Banned' },
  { name: 'redefine', pattern: /\b(redefine|redefines|redefining)\b/i, description: 'AI transformation cliché', suggestion: 'Use "change," "update," or describe the actual shift.', category: 'Tier 1 Banned' },
  { name: 'foster', pattern: /\b(foster|fosters|fostering)\b/i, description: 'Corporate AI speak', suggestion: 'Use "enable," "create," "support," or describe action.', category: 'Tier 1 Banned' },
  { name: 'facilitate', pattern: /\b(facilitate|facilitates|facilitating)\b/i, description: 'Corporate AI speak', suggestion: 'Use "ease," "help," "enable," or describe mechanism.', category: 'Tier 1 Banned' },
  { name: 'tapestry', pattern: /\btapestry\b/i, description: 'Overused AI metaphor', suggestion: 'Delete or describe specific components.', category: 'Tier 1 Banned' },
  { name: 'delve', pattern: /\b(delve|delves|delving|delve into)\b/i, description: 'Classic AI filler verb', suggestion: 'Use "examine," "investigate," "look at," or state directly.', category: 'Tier 1 Banned' },
  { name: 'realm', pattern: /\b(realm|realms|in the realm of)\b/i, description: 'Pompous AI filler', suggestion: 'Use "in," "within," or name the specific domain.', category: 'Tier 1 Banned' },
  { name: 'it is notable that', pattern: /\bit['’]?s?\s+notable\s+that\b/i, description: 'Throat-clearing filler', suggestion: 'Delete phrase and state the fact directly.', category: 'Tier 1 Banned' },
  { name: 'it is important to note', pattern: /\bit['’]?s?\s+important\s+to\s+note\b/i, description: 'Throat-clearing filler', suggestion: 'Delete phrase and state the fact directly.', category: 'Tier 1 Banned' },
  { name: 'in today\'s world', pattern: /\bin\s+today['’]?s\s+(world|society|age|environment|era)\b/i, description: 'Generic AI opener', suggestion: 'Specify exact timeframe or context.', category: 'Tier 1 Banned' },
  { name: 'rapidly evolving', pattern: /\b(rapidly|constantly|fast)\s+evolving\b/i, description: 'Generic AI filler', suggestion: 'Describe what actually changed.', category: 'Tier 1 Banned' },
  { name: 'paradigm shift', pattern: /\bparadigm\s+shift\b/i, description: 'Overused academic AI cliché', suggestion: 'Describe what shifted specifically.', category: 'Tier 1 Banned' },
  { name: 'model shift', pattern: /\bmodel\s+shift\b/i, description: 'AI cliché', suggestion: 'Describe the structural change.', category: 'Tier 1 Banned' },
  { name: 'at the end of the day', pattern: /\bat\s+the\s+end\s+of\s+the\s+day\b/i, description: 'Cliché filler', suggestion: 'Delete or state conclusion directly.', category: 'Tier 1 Banned' },
  { name: 'food for thought', pattern: /\bfood\s+for\s+thought\b/i, description: 'Weak non-conclusion', suggestion: 'End with specific question or implication.', category: 'Tier 1 Banned' },
  { name: 'only time will tell', pattern: /\bonly\s+time\s+will\s+tell\b/i, description: 'Lazy non-conclusion', suggestion: 'State your prediction.', category: 'Tier 1 Banned' },
  { name: 'the question remains', pattern: /\bthe\s+question\s+remains\b/i, description: 'Avoids taking a position', suggestion: 'Answer question or take a stance.', category: 'Tier 1 Banned' },
  { name: 'double-edged sword', pattern: /\bdouble[- ]edged\s+sword\b/i, description: 'Cliché metaphor', suggestion: 'Describe the two specific sides.', category: 'Tier 1 Banned' },
  { name: 'beacon', pattern: /\bbeacon\b/i, description: 'Grandiose AI fluff', suggestion: 'Use concrete terms.', category: 'Tier 1 Banned' },
  { name: 'testament to', pattern: /\btestament\s+to\b/i, description: 'Pompous AI fluff', suggestion: 'Use "shows," "demonstrates," or state fact.', category: 'Tier 1 Banned' },
  { name: 'game-changer', pattern: /\bgame[- ]changer\b/i, description: 'Overused hype word', suggestion: 'Describe specific functional difference.', category: 'Tier 1 Banned' },
  { name: 'pivotal role', pattern: /\b(pivotal|vital|crucial)\s+role\b/i, description: 'AI filler phrase', suggestion: 'Describe the exact function.', category: 'Tier 1 Banned' },
  { name: 'synergy', pattern: /\b(synergy|synergies|synergistic)\b/i, description: 'Corporate AI slop', suggestion: 'Describe benefit of combining.', category: 'Tier 1 Banned' },

  // Tier 2: Corporate Buzzwords in Filler Context
  { name: 'empower', pattern: /\b(empower|empowers|empowering|empowerment)\b/i, description: 'Patronizing AI speak', suggestion: 'Describe specific capability gained.', category: 'Tier 2 Buzzword' },
  { name: 'streamline', pattern: /\b(streamline|streamlines|streamlining)\b/i, description: 'Vague corporate buzzword', suggestion: 'Describe what becomes faster/simpler.', category: 'Tier 2 Buzzword' },
  { name: 'holistic', pattern: /\bholistic\b/i, description: 'Vague buzzword', suggestion: 'Use "complete," "full," or "end-to-end."', category: 'Tier 2 Buzzword' },
  { name: 'unlock value/potential', pattern: /\b(unlock|unlocks|unlocking)\s+(the\s+)?(potential|power|value|future)\b/i, description: 'AI-speak cliché', suggestion: 'State what actually happens.', category: 'Tier 2 Buzzword' },

  // Conversational AI Explainer Tropes
  { name: 'think of it as', pattern: /\b(think\s+of\s+(this|it|these)\s+(as|like))\b/i, description: 'Conversational AI explainer trope', suggestion: 'State what it is or how it functions directly.', category: 'Conversational Trope' },
  { name: 'imagine trying/you', pattern: /\b(imagine\s+(trying|you|a|the|if))\b/i, description: 'AI hypothetical explainer trope', suggestion: 'Use concrete real-world example directly.', category: 'Conversational Trope' },
  { name: 'consider a/how', pattern: /\b(consider\s+(a|how|this|ordering|trying))\b/i, description: 'AI hypothetical explainer trope', suggestion: 'State the scenario directly without "Consider".', category: 'Conversational Trope' },
  { name: 'picture this/a', pattern: /\b(picture\s+(this|a|someone|receiving))\b/i, description: 'AI hypothetical explainer trope', suggestion: 'State the scenario directly.', category: 'Conversational Trope' },
  { name: 'at its core', pattern: /\bat\s+its\s+core\b/i, description: 'AI reductionist trope', suggestion: 'Use "Fundamentally" or state core mechanism.', category: 'Conversational Trope' },
  { name: 'in simple terms', pattern: /\bin\s+simple\s+terms\b/i, description: 'Patronizing AI explanation', suggestion: 'State simply without announcing it.', category: 'Conversational Trope' },
  { name: 'here\'s how it works', pattern: /\bhere['’]?s\s+how\s+(it|this)\s+works\b/i, description: 'Formulaic AI transition', suggestion: 'Use "The mechanics are as follows" or state directly.', category: 'Conversational Trope' },

  // Tier 3: AI Sentence Patterns & Hedging
  { name: 'could potentially', pattern: /\bcould\s+potentially\b/i, description: 'Redundant double hedge', suggestion: 'Use "could" or "potentially", not both.', category: 'Tier 3 Pattern' },
  { name: 'might possibly', pattern: /\bmight\s+possibly\b/i, description: 'Redundant double hedge', suggestion: 'Use "might" or "possibly", not both.', category: 'Tier 3 Pattern' },
  { name: 'may potentially', pattern: /\bmay\s+potentially\b/i, description: 'Redundant double hedge', suggestion: 'Use "may" or "potentially", not both.', category: 'Tier 3 Pattern' },
  { name: 'in certain scenarios', pattern: /\bin\s+certain\s+scenarios\b/i, description: 'Vague position-avoiding hedge', suggestion: 'Name the specific scenario.', category: 'Tier 3 Pattern' },
  { name: 'remains to be seen', pattern: /\bremains\s+to\s+be\s+seen\b/i, description: 'Lazy non-conclusion', suggestion: 'Make a clear prediction.', category: 'Tier 3 Pattern' },
  { name: 'while there are certainly challenges', pattern: /\bwhile\s+there\s+are\s+certainly\s+challenges\b/i, description: 'Throat-clearing opener', suggestion: 'Delete and start with main point.', category: 'Tier 3 Pattern' },
  { name: 'in an era of', pattern: /\bin\s+an\s+era\s+of\b/i, description: 'Grandiose AI opener', suggestion: 'Start with specific data or observation.', category: 'Tier 3 Pattern' },
  { name: 'what follows is', pattern: /\bwhat\s+follows\s+is\b/i, description: 'Writer-note / lab-note transition', suggestion: 'State the next fact. Do not announce the method.', category: 'Conversational Trope' },
  { name: 'in this set', pattern: /\bin\s+this\s+set\b/i, description: 'Investigation leftover', suggestion: 'Name the countries, papers, or deals.', category: 'Conversational Trope' },
  { name: 'I compared', pattern: /\bI\s+compared\b/, description: 'Writer-diary voice', suggestion: 'State what the sources publish.', category: 'Conversational Trope' },
  { name: 'the data tells a story', pattern: /\bthe\s+data\s+tells\s+a\s+story\b/i, description: 'Consulting-AI opener', suggestion: 'Lead with the numbers.', category: 'Tier 3 Pattern' },
  { name: 'deeper shift/implication', pattern: /\bthe\s+deeper\s+(shift|implication)\s+is\b/i, description: 'AI punchline transition', suggestion: 'State the mechanism.', category: 'Tier 3 Pattern' },
  { name: 'moved from concept to', pattern: /\bmoved\s+from\s+concept\s+to\b/i, description: 'AI transformation cliché', suggestion: 'Name the products that shipped.', category: 'Tier 3 Pattern' },
  { name: 'being disrupted by', pattern: /\bbeing\s+disrupted\s+by\b/i, description: 'Consulting cliché', suggestion: 'Name what breaks in the invoice or product.', category: 'Tier 3 Pattern' },
  { name: 'notably comma', pattern: /\bNotably,/, description: 'Throat-clearing adverb', suggestion: 'Delete Notably and state the fact.', category: 'Conversational Trope' },
  { name: 'more importantly', pattern: /\bMore\s+importantly,?\b/, description: 'Throat-clearing adverb', suggestion: 'Delete and rank the facts in the sentence.', category: 'Conversational Trope' },
  { name: 'that said comma', pattern: /\bThat\s+said,/, description: 'Throat-clearing pivot', suggestion: 'Start the contrast without the pivot phrase.', category: 'Conversational Trope' },
  { name: 'open question is not whether', pattern: /\bthe\s+open\s+question\s+is\s+not\s+whether\b/i, description: 'False-certainty closer', suggestion: 'Name the actual fight.', category: 'Tier 3 Pattern' },
  { name: 'I say so', pattern: /\bI\s+say\s+so\b/, description: 'Writer-note leftover', suggestion: 'Label the source in the sentence.', category: 'Conversational Trope' },

  // Detector bait: openings that Fakespot marked 88-99% AI (Aug 2026)
  { name: 'no longer speculative', pattern: /\bno\s+longer\s+speculative\b/i, description: 'Detector-bait throat-clearing', suggestion: 'Cite the trial, paper, or number.', category: 'Tier 3 Pattern' },
  { name: 'clinically measured/significant', pattern: /\bclinically\s+(measured|significant)\b/i, description: 'Detector-bait medical puffery', suggestion: 'Print the effect size and the paper.', category: 'Tier 3 Pattern' },
  { name: 'these are not marginal', pattern: /\bthese\s+are\s+not\s+marginal\b/i, description: 'AI self-emphasis', suggestion: 'Delete. The number already ranks the effect.', category: 'Tier 3 Pattern' },
  { name: 'the pattern is STRUCT', pattern: /\b[Tt]he\s+pattern\s+is\s+(structural|familiar|clear|identical|consistent)\b/, description: 'Detector-bait abstracting sentence', suggestion: 'Name the cycle or the companies. Do not announce a pattern.', category: 'Tier 3 Pattern' },
  { name: 'signals the emergence', pattern: /\bsignals?\s+the\s+emergence\b/i, description: 'Consulting-AI verb stack', suggestion: 'Name what shipped.', category: 'Tier 3 Pattern' },
  { name: 'the convergence of', pattern: /\bthe\s+convergence\s+of\b/i, description: 'AI list-glue', suggestion: 'Name the two or three things and what they did.', category: 'Tier 3 Pattern' },
  { name: 'conflicting signals', pattern: /\bconflicting\s+signals\b/i, description: 'Consulting opener', suggestion: 'Name the vendor claim and the engineering block.', category: 'Tier 3 Pattern' },
  { name: 'predictable failure pattern', pattern: /\bpredictable\s+failure\s+pattern\b/i, description: 'AI framework label', suggestion: 'Describe the failed project.', category: 'Tier 3 Pattern' },
  { name: 'question is not whether', pattern: /\bthe\s+question\s+is\s+not\s+whether\b/i, description: 'False-binary closer', suggestion: 'Answer the real question in one sentence.', category: 'Tier 3 Pattern' },
  { name: 'dual problem', pattern: /\bdual\s+problem\b/i, description: 'AI two-sided frame', suggestion: 'State both costs without the label.', category: 'Tier 3 Pattern' },
  { name: 'foundational premise', pattern: /\bfoundational\s+premise\b/i, description: 'Textbook-AI opener', suggestion: 'Name the assumption and who still uses it.', category: 'Tier 3 Pattern' },
  { name: 'three different acts', pattern: /\bthree\s+different\s+acts\b/i, description: 'Writer-note tricolon', suggestion: 'Define announced, funded, spent with examples.', category: 'Conversational Trope' },
  { name: 'mismatch is structural', pattern: /\bmismatch\s+is\s+structural\b/i, description: 'Abstract diagnosis', suggestion: 'Name the two measurements that do not match.', category: 'Tier 3 Pattern' },
  { name: 'this is a category error', pattern: /\bthis\s+is\s+a\s+category\s+error\b/i, description: 'Academic-AI punch', suggestion: 'Say what people confuse with what.', category: 'Tier 3 Pattern' },
  { name: 'not because ambition', pattern: /\bnot\s+because\s+ambition\s+is\s+lacking\b/i, description: 'AI contrast filler', suggestion: 'Name the physical or economic limit.', category: 'Tier 3 Pattern' },
  { name: 'feedstock is running', pattern: /\bfeedstock\s+is\s+running\s+thin\b/i, description: 'Metaphor closer', suggestion: 'Say waking hours did not grow.', category: 'Tier 3 Pattern' },
  { name: 'clinical case for', pattern: /\bthe\s+clinical\s+case\s+for\b/i, description: 'AI case-building opener', suggestion: 'Lead with the trial.', category: 'Tier 3 Pattern' },
  { name: 'ambition is interesting', pattern: /\bambition\s+is\s+interesting\b/i, description: 'Hedged non-review', suggestion: 'Say whether the evidence holds.', category: 'Tier 3 Pattern' },
  { name: 'converging technologies', pattern: /\bconverging\s+technologies\b/i, description: 'TAM-slide glue', suggestion: 'Name the three technologies.', category: 'Tier 3 Pattern' },
  { name: 'in this phase comma', pattern: /\bIn\s+this\s+phase,/, description: 'Era-narration opener', suggestion: 'Name the product or protocol.', category: 'Tier 3 Pattern' },
  { name: 'structurally obsolete', pattern: /\bstructurally\s+obsolete\b/i, description: 'AI overclaim', suggestion: 'Say what the menu or tool still does, and what replaced the job.', category: 'Tier 3 Pattern' },
  { name: 'increasingly mediated', pattern: /\bincreasingly\s+mediated\b/i, description: 'Grandiose mediation opener', suggestion: 'Name the lab, the twin, or the miles.', category: 'Tier 3 Pattern' },
  { name: 'that era is ending', pattern: /\bthat\s+era\s+is\s+ending\b/i, description: 'Epoch closer', suggestion: 'Name the physical limit.', category: 'Tier 3 Pattern' },
  { name: 'empirical map', pattern: /\bempirical\s+map\b/i, description: 'Consulting-AI self-label', suggestion: 'Delete. Start with the count.', category: 'Tier 3 Pattern' },
  { name: 'several key factors', pattern: /\bseveral\s+key\s+factors\b/i, description: 'Meaningless framework', suggestion: 'List the factors.', category: 'Tier 3 Pattern' },
  { name: 'interesting to see', pattern: /\bit\s+will\s+be\s+interesting\s+to\s+see\b/i, description: 'Vague conclusion', suggestion: 'Make a prediction.', category: 'Tier 3 Pattern' },
  { name: 'as we move forward', pattern: /\bas\s+we\s+move\s+forward\b/i, description: 'Vague conclusion', suggestion: 'Name the next date or decision.', category: 'Tier 3 Pattern' },
  { name: 'stands at a crossroads', pattern: /\bstands\s+at\s+a\s+crossroads\b/i, description: 'Grandiose opener', suggestion: 'Start with a number.', category: 'Tier 3 Pattern' },
  { name: 'most consequential infrastructure', pattern: /\bmost\s+consequential\s+infrastructure\b/i, description: 'Unfalsifiable ranking', suggestion: 'Compare two named transitions, or drop the rank.', category: 'Tier 3 Pattern' },

  // Formatting & Punctuation Rules
  { name: 'em-dash', pattern: /[—–]/, description: 'Em-dash / En-dash character', suggestion: 'Use standard hyphens or rewrite into separate sentences.', category: 'Formatting' },
  { name: 'spelled percent', pattern: /\d+(?:\.\d+)?\s+percent\b/i, description: 'AI-style spelled percent', suggestion: 'Write 32% not 32 percent.', category: 'Formatting' },
  { name: 'per cent', pattern: /\bper\s+cent\b/i, description: 'Spelled per cent', suggestion: 'Use % after the number.', category: 'Formatting' },
];

export function cleanLineForProseAnalysis(line: string): string {
  let cleaned = line;
  // Remove inline code
  cleaned = cleaned.replace(/`[^`]+`/g, '');
  // Remove markdown images
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');
  // Remove JSX component tags and HTML attributes (e.g. src="...", alt="...", etc.)
  cleaned = cleaned.replace(/<[^>]+>/g, (tag) => {
    // If it's an image or figure tag, remove completely
    return '';
  });
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s\)]+/g, '');
  return cleaned;
}

export function checkEssayFile(filePath: string): SlopViolation[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: SlopViolation[] = [];
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);

  // Check 1: Frontmatter & Opening structure
  let inFrontmatter = false;
  let frontmatterEndedLine = 0;
  let firstContentLine = 0;
  let firstContentText = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '---') {
      if (!inFrontmatter && i === 0) {
        inFrontmatter = true;
        continue;
      } else if (inFrontmatter) {
        inFrontmatter = false;
        frontmatterEndedLine = i + 1;
        continue;
      }
    }

    if (!inFrontmatter && line.length > 0) {
      if (firstContentLine === 0) {
        firstContentLine = i + 1;
        firstContentText = line;
      }
    }
  }

  // Opening paragraph checks (Rule 8 & 9)
  if (firstContentText.startsWith('<Figure') || firstContentText.startsWith('<Callout')) {
    violations.push({
      file: relativePath,
      line: firstContentLine,
      type: 'Opening Structure',
      match: firstContentText.slice(0, 35),
      context: `Essay starts with ${firstContentText.startsWith('<Figure') ? '<Figure>' : '<Callout>'} instead of plain-text opening paragraph.`,
      suggestion: 'Move plain-text opening paragraph before any <Figure> or <Callout>.'
    });
  }

  // Check line by line for banned patterns
  let isInsideCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      isInsideCodeBlock = !isInsideCodeBlock;
      continue;
    }

    if (isInsideCodeBlock) continue;

    // Skip frontmatter lines for word checks
    if (i < frontmatterEndedLine) continue;

    // Skip lines that quote slop as bad examples (e.g., in revision.mdx or ai-detector.mdx or self-referential lists)
    if (trimmed.startsWith('- Filler constructions') || trimmed.includes('Banned AI') || trimmed.includes('slop-avoidance')) {
      continue;
    }

    const proseLine = cleanLineForProseAnalysis(rawLine);

    for (const rule of SLOP_RULES) {
      // Special check for 'explore': state-space / quantum computing physics context exception
      if (rule.name === 'explore') {
        if (proseLine.match(/qubit|state space|states simultaneously|exploration phase/i)) {
          continue;
        }
      }

      // Special check for 'landscape': ignore if in quoted examples
      if (rule.name === 'landscape') {
        if (rawLine.includes('"') && rawLine.includes('landscape')) {
          const quoteMatch = rawLine.match(/"([^"]*landscape[^"]*)"/);
          if (quoteMatch && (quoteMatch[1].includes('rapidly evolving') || quoteMatch[1].includes('filler'))) {
            continue;
          }
        }
      }

      const match = proseLine.match(rule.pattern);
      if (match) {
        violations.push({
          file: relativePath,
          line: i + 1,
          type: rule.name,
          match: match[0],
          context: `Line ${i + 1}: "${trimmed}"`,
          suggestion: rule.suggestion
        });
      }
    }
  }

  return violations;
}

export function runAudit(): { totalFiles: number; totalViolations: number; violationsByFile: Record<string, SlopViolation[]> } {
  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  if (!fs.existsSync(essaysDir)) {
    throw new Error(`Essays directory not found at: ${essaysDir}`);
  }

  const files = fs.readdirSync(essaysDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  let totalViolations = 0;
  const violationsByFile: Record<string, SlopViolation[]> = {};

  for (const file of files) {
    const fullPath = path.join(essaysDir, file);
    const violations = checkEssayFile(fullPath);
    if (violations.length > 0) {
      violationsByFile[file] = violations;
      totalViolations += violations.length;
    }
  }

  const glossaryPath = path.join(process.cwd(), 'src', 'lib', 'glossary.ts');
  if (fs.existsSync(glossaryPath)) {
    const glossaryViolations = checkEssayFile(glossaryPath).filter((v) => {
      const line = v.context || '';
      return /definition:/i.test(line) || v.type === 'em-dash';
    });
    if (glossaryViolations.length > 0) {
      violationsByFile['glossary.ts'] = glossaryViolations;
      totalViolations += glossaryViolations.length;
    }
  }

  return {
    totalFiles: files.length + (fs.existsSync(glossaryPath) ? 1 : 0),
    totalViolations,
    violationsByFile
  };
}

if (process.argv[1] && process.argv[1].endsWith('check-ai-slop.ts')) {
  try {
    const { totalFiles, totalViolations, violationsByFile } = runAudit();
    console.log(`\n🔍 Audited ${totalFiles} files (essays + glossary) for AI slop, writing patterns, and structural rules...\n`);

    if (totalViolations === 0) {
      console.log('✨ CLEAN! Zero AI slop violations found across all essays.\n');
      process.exit(0);
    } else {
      console.log(`❌ FOUND ${totalViolations} VIOLATION(S) ACROSS ${Object.keys(violationsByFile).length} FILE(S):\n`);
      for (const [file, list] of Object.entries(violationsByFile)) {
        console.log(`📁 ${file} (${list.length} issue${list.length > 1 ? 's' : ''}):`);
        for (const v of list) {
          console.log(`  - Line ${v.line} [${v.type}]: ${v.context}`);
          console.log(`    💡 Fix: ${v.suggestion}`);
        }
        console.log('');
      }
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`Audit error: ${err.message}`);
    process.exit(1);
  }
}
