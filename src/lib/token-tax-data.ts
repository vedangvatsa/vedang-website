// Checked against the saved main-run summary by generate-token-tax-assets.ts.
export const tokenTaxStudy = {
  slug: 'tokens',
  sections: 300,
  questions: 888,
  mainRequests: 1500,
  totalExperimentalRequests: 1900,
  modelAlias: 'gpt-6.1-sol',
  mainRunDate: '2026-10-12',
  pageTokenCounter: 'o200k_base',
  paperUrl: '/docs/the-token-tax-of-the-web.pdf',
  dataUrl: '/data/token-tax-results.json',
} as const;

export const tokenTaxFormats = [
  { id: 'source_html', label: 'Saved HTML', pageTokens: 625455, inputTokens: 724469, matches: 805 },
  { id: 'clean_html', label: 'Cleaned HTML', pageTokens: 286312, inputTokens: 385326, matches: 798 },
  { id: 'markdown', label: 'Markdown', pageTokens: 94874, inputTokens: 194035, matches: 798 },
  { id: 'plain_text', label: 'Plain text', pageTokens: 67658, inputTokens: 166936, matches: 784 },
  { id: 'json_tree', label: 'Nested JSON', pageTokens: 348183, inputTokens: 447197, matches: 795 },
] as const;
