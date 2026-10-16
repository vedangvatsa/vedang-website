/**
 * Publish the checked paper, chart, and count data from the local study.
 * Usage: npx tsx scripts/generate-token-tax-assets.ts /path/to/papers/token-tax
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { tokenTaxFormats, tokenTaxStudy } from '../src/lib/token-tax-data';
import { generateTerminalOgImage } from '../src/lib/og-image';

const source = process.argv[2];
assert(source, 'Pass the token-tax study directory.');
const readJson = (relative: string) => JSON.parse(fs.readFileSync(path.join(source, relative), 'utf8'));
const main = readJson('results/main/summary.json');
const publication = readJson('review/publication_check.json');
const paper = fs.readFileSync(path.join(source, 'token_tax.pdf'));
const sha256 = (data: Buffer) => createHash('sha256').update(data).digest('hex');

assert.equal(main.pages, tokenTaxStudy.sections);
assert.equal(main.questions, tokenTaxStudy.questions);
assert.equal(main.calls, tokenTaxStudy.mainRequests);
assert.equal(sha256(paper), publication.pdf_sha256, 'The paper must match its publication check.');
assert.equal(
  sha256(fs.readFileSync(path.join(source, 'token_tax.md'))),
  publication.markdown_sha256,
  'The manuscript must match its publication check.',
);
for (const format of tokenTaxFormats) {
  const saved = main.formats[format.id];
  assert.equal(format.pageTokens, saved.total_page_tokens, `${format.id}: page tokens`);
  assert.equal(format.inputTokens, saved.reported_input, `${format.id}: input tokens`);
  assert.equal(format.matches, saved.correct, `${format.id}: key matches`);
}

const clean = tokenTaxFormats.find((format) => format.id === 'clean_html')!;
const markdown = tokenTaxFormats.find((format) => format.id === 'markdown')!;
const inputSaving = 100 * (1 - markdown.inputTokens / clean.inputTokens);
const pageSaving = 100 * (1 - markdown.pageTokens / clean.pageTokens);
const number = (value: number) => value.toLocaleString('en-US');
const results = {
  title: 'The Token Tax of the Web',
  ...tokenTaxStudy,
  paperSha256: publication.pdf_sha256,
  formats: tokenTaxFormats,
  markdownVsCleanedHtml: {
    completeInputReductionPercent: inputSaving,
    pageTextReductionPercent: pageSaving,
    medianPageTextReductionPercent: 100 * main.formats.markdown.median_page_saving_vs_clean,
  },
  answerReview: readJson('results/answer_meaning/summary.json'),
  languageCounts: readJson('results/language_check/summary.json'),
};

const publicRoot = path.resolve('public');
const paperPath = path.join(publicRoot, tokenTaxStudy.paperUrl);
const dataPath = path.join(publicRoot, tokenTaxStudy.dataUrl);
const imagePath = path.join(publicRoot, 'images/essays/token-tax-input.svg');
const ogPath = path.join(publicRoot, `og/${tokenTaxStudy.slug}.png`);
for (const file of [paperPath, dataPath, imagePath, ogPath]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}
fs.writeFileSync(paperPath, paper);
fs.writeFileSync(dataPath, `${JSON.stringify(results, null, 2)}\n`);
fs.writeFileSync(imagePath, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" role="img" aria-labelledby="title desc">
  <title id="title">${inputSaving.toFixed(1)}% fewer complete input tokens with Markdown</title>
  <desc id="desc">Cleaned HTML used ${number(clean.inputTokens)} tokens. Markdown used ${number(markdown.inputTokens)}. Each matched ${clean.matches} of ${tokenTaxStudy.questions} expected answers across ${tokenTaxStudy.sections} saved sections.</desc>
  <rect x="1" y="1" width="798" height="398" rx="8" fill="#ffffff" stroke="#e3e3e0"/>
  <g font-family="Arial, Helvetica, sans-serif" fill="#37352f">
    <text x="40" y="58" font-size="32" font-weight="700">${inputSaving.toFixed(1)}% fewer input tokens</text>
    <text x="40" y="91" font-size="20" fill="#52525b">Markdown compared with cleaned HTML</text>
    <text x="40" y="151" font-size="24">Cleaned HTML</text>
    <text x="760" y="151" font-size="24" font-weight="700" text-anchor="end">${number(clean.inputTokens)}</text>
    <rect x="40" y="170" width="720" height="36" rx="3" fill="#64748b" opacity="0.65"/>
    <text x="40" y="253" font-size="24">Markdown</text>
    <text x="760" y="253" font-size="24" font-weight="700" text-anchor="end">${number(markdown.inputTokens)}</text>
    <rect x="40" y="272" width="${(720 * markdown.inputTokens / clean.inputTokens).toFixed(2)}" height="36" rx="3" fill="#6366f1" opacity="0.65"/>
    <text x="40" y="358" font-size="20">${clean.matches} / ${tokenTaxStudy.questions} answer-key matches in each format</text>
    <text x="760" y="380" font-size="16" fill="#52525b" text-anchor="end">veda.ng/${tokenTaxStudy.slug}</text>
  </g>
</svg>\n`);
assert.equal(sha256(fs.readFileSync(paperPath)), publication.pdf_sha256);

async function finishAssets() {
  const image = generateTerminalOgImage(
    'The Token Tax',
    'of the Web',
    `veda.ng/${tokenTaxStudy.slug}`,
    [
      { text: 'Markdown / cleaned HTML', color: 'command' },
      { text: `${inputSaving.toFixed(1)}% less input`, color: 'success' },
      { text: `${clean.matches} matches each`, color: 'success' },
    ],
    `${tokenTaxStudy.sections} saved sections. ${tokenTaxStudy.questions} questions.`,
  );
  fs.writeFileSync(ogPath, Buffer.from(await image.arrayBuffer()));
  console.log(JSON.stringify({
    checkedFormats: tokenTaxFormats.length,
    inputSaving: inputSaving.toFixed(1),
    pageSaving: pageSaving.toFixed(1),
    paperSha256: publication.pdf_sha256,
    files: [paperPath, dataPath, imagePath, ogPath].map((file) => path.relative(process.cwd(), file)),
  }, null, 2));
}

finishAssets().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
