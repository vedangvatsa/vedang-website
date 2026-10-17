# Agentcommerce essay update

Route: `/agentcommerce`. Title: **When an AI Buys the Wrong Thing**.

The rewrite uses the reviewed agentic-commerce manuscript and its inspected primary sources. The original publication date remains March 24, 2026; the updated field records October 17, 2026. No review-completion announcement was added to the prose.

## Editorial and evidence changes

- Replaced unsupported market forecasts, unlike-survey trust-gap arithmetic, blanket claims about agents ignoring brands, and the claim that electronic agents generally cannot form contracts.
- Distinguished advice, per-order approval, and advance permission.
- Kept EComAgentBench's recommendation-task results separate from real orders. The chart uses Table 3 of arXiv version 2606.17698v3: Opus 4.6 accuracy 57.1%, requirements score 76.6%; GPT-5.4 accuracy 47.0%, requirements score 81.0%. Both chart axes run from 0 to 100.
- Reported Riskified's different samples and questions without inferring a longitudinal trust decline or treating referral purchases as autonomous orders.
- Preserved the limits of forecasting experiments, hotel-ranking data, simulated inspection costs, and synthetic security tests.
- Described the outcome cards and hero as proposed checks, not measured effects.
- Corrected one linked paragraph in `receipts.mdx` that referred to an unsupported comparable trust gap.

Sources are linked inline. Mutable OpenAI shopping guidance and AP2 security requirements were inspected again for this essay. No original shopping experiment or market forecast is claimed.

## Checks

- 3,795 manuscript words using the page's word-count method.
- `npm run lint:slop`: zero violations in the two changed essays.
- `npm run typecheck`: passed before production-generated route types and again after refreshing the branch from upstream.
- All checked SVGs under `public/images` passed `xmllint --noout`.
- ESLint reported no errors in the chart and essay route; four existing unused-variable warnings remain in the shared route.
- Local browser checks passed for the title, canonical URL, publication/update dates, opening paragraph, loaded hero, direct figure captions, and all four chart values.
- The 390px mobile viewport had no document-level horizontal overflow. Desktop/mobile chart images were inspected.
- Local Webpack development bundles required the test browser's CSP bypass for their eval-based tooling. Production CSP was not changed.

The first production build found an existing synchronous `params` type in the prompt course route. A one-line Promise annotation resolved that locally; the same correction arrived upstream during the update. The next build passed compilation and TypeScript, then stopped during static generation with `ENOSPC`. Temporary build output was cleared. This record does not claim a completed production build.

The repository-wide dash scan also found 20 existing matches in unrelated essays. The changed essays contain no em/en dashes. The final work follows the user's instruction to commit and push, without a manual deployment or social posting.
