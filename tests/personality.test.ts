import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import study from '../src/lib/personality-data.json';
import { checkEssayFile } from '../scripts/check-ai-slop';

const root = process.cwd();
const file = path.join(root, 'src/content/essays/llmpersonality.mdx');
const { data: frontmatter, content } = matter(fs.readFileSync(file, 'utf8'));

test('personality essay preserves denominators, eligibility, and missing scores', () => {
  assert.equal(study.models.length, 55);
  assert.equal(study.models.reduce((sum, model) => sum + model.planned, 0), 460);
  assert.equal(study.models.reduce((sum, model) => sum + model.usable, 0), 422);
  assert.equal(study.models.filter((model) => model.eligibleTraits === 5).length, 22);
  assert.equal(study.models.filter((model) => model.eligibleTraits === 0).length, 8);
  assert.equal(study.models.reduce((sum, model) => sum + model.eligibleTraits, 0), 178);
  for (const model of study.models) {
    assert.equal(model.required, Math.max(3, Math.ceil(model.planned / 2)));
    assert.equal(model.traits.filter((trait) => trait.eligible).length, model.eligibleTraits);
    for (const trait of model.traits) {
      assert.equal(trait.eligible, trait.n >= model.required);
      assert.ok(trait.n <= model.usable);
      if (trait.eligible) {
        assert.ok(Number(trait.mean) >= 1 && Number(trait.mean) <= 5);
        assert.notEqual(trait.sd, null);
      } else {
        assert.equal(trait.mean, null);
        assert.equal(trait.sd, null);
      }
    }
  }
});

test('subset illustrations retain ties and the full comparison denominator', () => {
  for (const row of study.comparisons) {
    assert.equal(row.retained + row.reversed + row.ties, row.pairs);
  }
  const smallGap = study.comparisons.find((row) => row.left === 'Gemini 3.5 Flash-Lite');
  assert.ok(smallGap);
  assert.deepEqual([smallGap.difference, smallGap.retained, smallGap.reversed, smallGap.pairs], ['0.06', 60, 40, 100]);
});

test('public study assets match the source checksums and do not depend on local files', () => {
  const publicRoot = path.join(root, 'public');
  const manifest = JSON.parse(fs.readFileSync(path.join(publicRoot, 'research/personality/manifest.json'), 'utf8'));
  for (const [relative, expected] of Object.entries(manifest.publicArtifacts)) {
    assert.ok(!relative.includes('..'));
    const raw = fs.readFileSync(path.join(publicRoot, relative));
    assert.equal(createHash('sha256').update(raw).digest('hex'), expected);
  }
  assert.equal(manifest.sourceFiles['template.pdf'], manifest.publicArtifacts['research/personality/paper.pdf']);
  assert.equal(manifest.sourceFiles['results/overall/reported_profiles.csv'], manifest.publicArtifacts['research/personality/reported-profiles.csv']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(publicRoot, 'research/personality/data.json'), 'utf8')), study);
  assert.ok(!content.includes('file://'));
  assert.ok(!content.includes('/Users/'));
  for (const match of content.matchAll(/\]\((\/research\/personality\/[^)]+)\)/g)) {
    assert.ok(fs.existsSync(path.join(publicRoot, match[1])));
  }
});

test('blog post has an author, a text opening, attributed images, and clean prose', () => {
  assert.equal(frontmatter.author, 'Vedang Vatsa');
  assert.ok(typeof frontmatter.title === 'string' && frontmatter.title.length > 0);
  const opening = content.slice(0, content.indexOf('<Figure')).trim();
  assert.ok(opening.length > 0 && !opening.startsWith('<'));
  const figures = [...content.matchAll(/<Figure\s[^>]+\/>/g)].map((match) => match[0]);
  assert.ok(figures.length > 0);
  for (const figure of figures) {
    assert.match(figure, /alt="[^"]+"/);
    assert.match(figure, /sourceUrl="\/research\/personality\//);
    const src = figure.match(/src="([^"]+)"/)?.[1];
    assert.ok(src);
    const svg = fs.readFileSync(path.join(root, 'public', src), 'utf8');
    assert.match(svg, /<svg[^>]+width="800"[^>]+height="\d+"/);
    assert.ok(svg.includes('<title'));
    assert.ok(svg.includes('<desc'));
  }
  assert.deepEqual(checkEssayFile(file), []);
});
