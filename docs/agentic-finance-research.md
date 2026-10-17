# Agentic Finance research record

Research date: 17 October 2026. Publication route: `/finance`.

## Question and claim

The essay examines financial agents across consumer finance, banking, corporate finance, credit, insurance, investing, and payments. Its commercial thesis favors narrow, repeatable tasks with explicit authority and externally checkable completion. This is a research-based argument, not a measured comparison of agent-company profitability.

The strongest counterarguments are incumbent bundling, high integration and review costs, limited willingness to pay, and evidence that broader delegated services outperform narrowly scoped products. Private customer retention, margins, and financial-loss records were unavailable. The essay makes no market-size or funding claim requiring those records.

## Source decisions

- The Bank of England/FCA 2024 survey received 118 responses. Its 75% AI-use figure is a share of responding firms; its 2% full-autonomy figure is a share of reported AI use cases. The essay does not compare them as a common-denominator chart or present them as October 2026 agent adoption.
- Anthropic's workflow/agent distinction supplies a useful architectural definition. Its December 2024 article acknowledges later tooling changes. The essay uses its conceptual distinction, not its historical product list as a current market map.
- Plaid Auth and Transfer documentation verifies the distinction between account information and a money-movement service. Transfer has a US scope and approval process.
- Stripe Link Agent Wallet documents customer approval before a one-time-use payment credential. Its payment and financial-insight capabilities have different regional availability.
- Stripe's current idempotency documentation distinguishes API v1 from v2. The essay avoids claiming that all versions return identical errors or that a key provides an indefinite duplicate-payment guarantee.
- AP2's current specification is v0.2. Use Checkout and Payment Mandates, not the older announcement's Intent/Cart taxonomy. Verification is deterministic; agent-to-agent mandate delegation and some dispute procedures are outside this version's scope.
- Stripe's Shared Payment Tokens documentation specifies seller, currency, amount and expiry limits and possible further customer authentication. It supports a bounded-credential example, not proof of general autonomous payment adoption.
- Coinbase's x402 documentation specifies request, price, signed authorization, verification, work, settlement, and response. Its activity counts are vendor-reported and are not used as evidence of profitable agent demand.
- Microsoft Account Reconciliation Agent documentation dated 8 September 2026 calls the product a production-ready preview and describes recommendations, user actions, and an activity record. It supplies no comparable production error-rate series.
- Intuit's 14 October 2026 release describes listed international features as rolling out in beta and varies availability by product/region. The essay retains that status and does not repeat its time-saving claims as independently verified results.
- Ramp's product FAQ states that money movement requires human confirmation. Its claims of perfect coding and no hallucinations are not adopted as factual guarantees.
- Morgan Stanley's 26 June 2024 release describes notes, drafts, adviser editing and sending, and Salesforce records with consent. It is not treated as an autonomous portfolio-management result.
- SEC Knight Capital findings concern an earlier automated router, not an LLM agent. Preserve more than four million orders, 212 customer orders, 45 minutes, and more than $460 million in losses, with the 2012 event distinguished from the 2013 enforcement release.
- SEC's 18 March 2024 Delphia/Global Predictions release reports settled charges and $400,000 total civil penalties. State the without-admitting-or-denying settlement qualification. This is not a measured agent-trading loss.
- Regulation B section 1002.9 and its official interpretation require applicable adverse-action reasons to reflect actual factors considered. Use the current regulatory text rather than a possibly superseded interpretive circular.
- FINRA Notice 24-09 is a reminder about existing obligations, not a new legal requirement or license for agents.
- The EU Commission's current implementation page reflects AI Omnibus changes and identifies 2 December 2027 for Annex III high-risk obligations. Do not reuse the superseded general August 2026 high-risk timetable. The AI Act Service Desk verifies Annex III creditworthiness/fraud and life/health-insurance classifications.
- The EU Commission's cyber-resilience page supports the DORA discussion. Earlier guessed DORA landing-page URLs returned 404 and are not cited.
- RBI's 8 May 2025 Digital Lending Directions were read in full for the cited sections. Paragraph 5(vii) retains the regulated entity's responsibility. Data-consent and funds-flow requirements are scoped to covered digital lending; the regulatory term LSP is not an LLM-agent definition.
- FSB's 15 October 2026 final report contains 12 sound practices. These are recommendations for institutions, not a universal legally binding approval. Its 2024 stability report supplies the concentration and correlated-risk discussion.
- FinQA's repository supports a description of financial numerical question answering. No FinQA score is represented as proof of transaction execution or financial-agent performance.

## Cost model

All values are illustrative assumptions, not observations or vendor prices.

| Input | Default |
| --- | ---: |
| Submitted tasks per month | 10,000 |
| Accepted completion rate | 95% |
| Automated cost per submitted task, including retries | USD 0.20 |
| Allocated monthly overhead | USD 3,000 |
| Review duration | 3 minutes |
| Loaded review labor rate | USD 40/hour |
| Example fee per accepted task | USD 1.00 |

Review cost is `submitted * reviewed_share * minutes / 60 * hourly_rate`. Total operating cost adds allocated overhead and automated cost for all submitted tasks. Cost per accepted task divides that total by `submitted * accepted_share`.

At review shares of 5%, 20%, and 50%, monthly costs are USD 6,000, 9,000, and 15,000. Dividing by 9,500 accepted tasks gives approximately USD 0.63, 0.95, and 1.58. Revenue at the illustrative USD 1 fee is USD 9,500, leaving USD 3,500, 500, and -5,500 after listed costs. These are not net-profit forecasts. Financial errors, sales, taxes, and any costs outside the stated overhead are excluded explicitly.

Completion is held constant to show cost sensitivity. No claim is made that reducing review preserves quality. No live trades, payments, customer records, or model trials were used.

## Editorial and publication requirements

Use direct language, preserve the scope of each number, and remove stock transitions and repeated summaries. Figures must distinguish proposed designs from observed results. Keep ordinary HTML tables in the essay so the text remains understandable without the interactive chart. Publish through an essay-only GitHub update preserving concurrent work. No manual deployment or social posting.

## Verification results

- The source register contains 25 primary sources; the generator checks that every registered URL is cited and every external citation is registered.
- The cost-model tests pass for the three published scenarios, unaccepted work, zero accepted completions, and the separate savings from automation and review changes.
- Targeted ESLint and the TypeScript check passed. The production Next.js build passed and generated `/finance`.
- All SVGs under `public/images` passed XML validation.
- Browser checks at 1440px and 390px passed. The calculator displayed USD 0.95 by default, USD 1.58 at 50% review, and USD 3.00 at 50% review with 50% acceptance. Reset restored the defaults.
- No page JavaScript errors or mobile page-width overflow appeared. The essay, Markdown route, source register, hero image, and sharing image loaded. The homepage, essay index, RSS, sitemap, and LLM index included the route.
- The rendered article contained 4,657 words including tables, calculator text, and captions. The writing assistant read the draft for clarity and repeated explanations; the automated phrase scan found zero violations.
