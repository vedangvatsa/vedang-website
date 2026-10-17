export const financeCostAssumptions = {
  submittedTasks: 10000,
  acceptedPercent: 95,
  automatedCostUsd: 0.20,
  monthlyOverheadUsd: 3000,
  reviewMinutes: 3,
  hourlyLaborUsd: 40,
  feePerAcceptedUsd: 1,
};

export const financeMedia = [
  {
    id: 'nyse-highsmith',
    title: 'Historical New York Stock Exchange trading floor',
    creator: 'Carol M. Highsmith',
    collection: 'Library of Congress, Prints and Photographs Division',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:New_York_Stock_Exchange_trading_floor_on_Wall_Street,_New_York,_New_York_LCCN2011634218.tif',
    downloadUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/New_York_Stock_Exchange_trading_floor_on_Wall_Street%2C_New_York%2C_New_York_LCCN2011634218.tif/lossy-page1-1280px-New_York_Stock_Exchange_trading_floor_on_Wall_Street%2C_New_York%2C_New_York_LCCN2011634218.tif.jpg',
    localPath: '/images/essays/agenticfinance-nyse.jpg',
    license: 'Public domain (Highsmith collection)',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:New_York_Stock_Exchange_trading_floor_on_Wall_Street,_New_York,_New_York_LCCN2011634218.tif#Licensing',
    changes: 'Uses the Wikimedia JPEG preview of the original photograph; no crop or added text.',
    context: 'Historical trading-floor photograph. It does not depict the Knight Capital incident or an AI deployment.',
  },
  {
    id: 'ap2-authorization',
    title: 'AP2 action authorization overview',
    creator: 'Google / AP2 contributors',
    sourceUrl: 'https://github.com/google-agentic-commerce/AP2/blob/e1ea56db72a6385bce3e5c1112b3a56ce60acb43/docs/assets/action_authorization_overview.svg',
    downloadUrl: 'https://raw.githubusercontent.com/google-agentic-commerce/AP2/e1ea56db72a6385bce3e5c1112b3a56ce60acb43/docs/assets/action_authorization_overview.svg',
    localPath: '/images/essays/agenticfinance-ap2-authorization.svg',
    license: 'Apache-2.0',
    licenseUrl: 'https://github.com/google-agentic-commerce/AP2/blob/e1ea56db72a6385bce3e5c1112b3a56ce60acb43/LICENSE',
    localLicensePath: '/images/essays/agenticfinance-ap2-LICENSE.txt',
    changes: 'Original SVG preserved; display size controlled by the page.',
    context: 'Diagram from the protocol repository, not a measurement of live payment performance.',
  },
] as const;

export function calculateFinanceCosts(
  reviewedPercent: number,
  acceptedPercent = financeCostAssumptions.acceptedPercent,
  automatedCostUsd = financeCostAssumptions.automatedCostUsd,
) {
  if (!Number.isFinite(reviewedPercent) || reviewedPercent < 0 || reviewedPercent > 100
    || !Number.isFinite(acceptedPercent) || acceptedPercent < 0 || acceptedPercent > 100
    || !Number.isFinite(automatedCostUsd) || automatedCostUsd < 0) {
    throw new RangeError('Use percentages from 0 to 100 and a non-negative automated cost.');
  }
  const a = financeCostAssumptions;
  const acceptedTasks = a.submittedTasks * acceptedPercent / 100;
  const reviewedTasks = a.submittedTasks * reviewedPercent / 100;
  const automatedCost = a.submittedTasks * automatedCostUsd;
  const reviewCost = reviewedTasks * a.reviewMinutes / 60 * a.hourlyLaborUsd;
  const totalCost = a.monthlyOverheadUsd + automatedCost + reviewCost;
  const revenue = acceptedTasks * a.feePerAcceptedUsd;
  return {
    reviewedPercent, acceptedPercent, acceptedTasks, reviewedTasks,
    overhead: a.monthlyOverheadUsd, automatedCost, reviewCost, totalCost,
    costPerAccepted: acceptedTasks === 0 ? null : totalCost / acceptedTasks,
    revenue,
    balanceAfterListedCosts: revenue - totalCost,
  };
}

export const financeSources = [
  {
    id: 'boe-fca-survey',
    title: 'Artificial intelligence in UK financial services - 2024',
    url: 'https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024',
    type: 'Regulator survey',
    date: '2024-11-21',
    supports: '118 respondents; 75% of responding firms used AI; 2% of reported AI use cases involved fully autonomous decisions. Denominators differ.',
  },
  {
    id: 'agent-definition',
    title: 'Building effective agents',
    url: 'https://www.anthropic.com/engineering/building-effective-agents',
    type: 'Engineering explanation',
    date: '2024-12-19',
    supports: 'Distinction between predefined workflows and model-directed tool use. The essay does not treat its historical tooling list as a current market census.',
  },
  {
    id: 'stripe-idempotency',
    title: 'Stripe idempotent requests',
    url: 'https://docs.stripe.com/api/idempotent_requests',
    type: 'API documentation',
    supports: 'Retry behavior depends on API version, execution state, and key lifetime. Keys do not provide an indefinite duplicate-payment guarantee.',
  },
  {
    id: 'plaid-auth',
    title: 'Plaid Auth introduction',
    url: 'https://plaid.com/docs/auth/',
    type: 'API documentation',
    supports: 'Auth supplies account information and needs a payment processor to move money.',
  },
  {
    id: 'plaid-transfer',
    title: 'Plaid Transfer introduction',
    url: 'https://plaid.com/docs/transfer/',
    type: 'API documentation',
    supports: 'Transfer is a US-only money-movement product with an application and approval process.',
  },
  {
    id: 'link-wallet',
    title: 'Link Agent Wallet',
    url: 'https://docs.stripe.com/agentic-commerce/agents/link-agent-wallet',
    type: 'Product documentation',
    supports: 'Customer approval precedes a one-time-use payment credential. Agent payments and financial insights have different listed regional availability.',
  },
  {
    id: 'microsoft-reconciliation',
    title: 'Account Reconciliation Agent (production ready preview)',
    url: 'https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/acct-rec-agent',
    type: 'Preview product documentation',
    date: '2026-09-08',
    supports: 'Recommendations for selected exceptions, user actions, and an activity history; not a measured production error rate.',
  },
  {
    id: 'regulation-b',
    title: 'Regulation B, section 1002.9 Notifications',
    url: 'https://www.consumerfinance.gov/rules-policy/regulations/1002/9/',
    type: 'Regulation and official interpretation',
    supports: 'Applicable adverse-action notices and reasons. Specific reasons relate to the factors actually considered or scored, subject to the rule’s scope and procedures.',
  },
  {
    id: 'ai-act-annex',
    title: 'EU AI Act Annex III',
    url: 'https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3',
    type: 'Official legal text service',
    supports: 'Specified creditworthiness uses, the financial-fraud exception, and natural-person life and health insurance risk assessment and pricing.',
  },
  {
    id: 'morgan-stanley',
    title: 'AI at Morgan Stanley Debrief launch',
    url: 'https://www.morganstanley.com/press-releases/ai-at-morgan-stanley-debrief-launch',
    type: 'Institutional announcement',
    date: '2024-06-26',
    supports: 'Meeting notes, summaries, adviser-editable drafts, and Salesforce records with client consent; not autonomous portfolio management.',
  },
  {
    id: 'knight-capital',
    title: 'SEC Charges Knight Capital With Violations of Market Access Rule',
    url: 'https://www.sec.gov/newsroom/press-releases/2013-222',
    type: 'Enforcement findings',
    date: '2013-10-16',
    supports: 'August 2012 incident: more than four million orders, 212 customer orders, first 45 minutes, and more than USD 460 million eventual loss. Not an LLM-agent incident.',
  },
  {
    id: 'mcp',
    title: 'Model Context Protocol architecture overview',
    url: 'https://modelcontextprotocol.io/docs/learn/architecture',
    type: 'Protocol documentation',
    supports: 'Tools and context exchange; application behavior and financial authority are separate concerns.',
  },
  {
    id: 'ap2',
    title: 'Agentic Payment Protocol v0.2',
    url: 'https://ap2-protocol.org/ap2/specification/',
    type: 'Protocol specification',
    supports: 'Checkout and Payment Mandates, direct and autonomous modes, deterministic verification, receipts, and explicit scope exclusions.',
  },
  {
    id: 'stripe-spt',
    title: 'Shared payment tokens for agents',
    url: 'https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens.md?agent-seller=agent',
    type: 'API documentation',
    supports: 'Seller, currency, amount, and expiry limits; revocation and possible further customer authentication.',
  },
  {
    id: 'x402',
    title: 'How x402 works',
    url: 'https://docs.cdp.coinbase.com/x402/how-it-works',
    type: 'Protocol implementation documentation',
    supports: 'Per-request payment with verification and settlement. Does not establish the value or correctness of a purchased answer.',
  },
  {
    id: 'intuit',
    title: 'Intuit Intelligence international availability',
    url: 'https://investors.intuit.com/news-events/press-releases/detail/1326/intuit-intelligence-now-available-internationally-fueling-success-for-businesses-and-accountants-on-one-unified-platform',
    type: 'Company announcement',
    date: '2026-10-14',
    supports: 'Listed international automation, invoicing, and reporting features rolling out in beta; product and region differences. Promotional time-saving figures are not treated as independently verified.',
  },
  {
    id: 'ramp',
    title: 'Ramp Intelligence product description and FAQ',
    url: 'https://ramp.com/ai',
    type: 'Company product description',
    supports: 'Expense and invoice functions; FAQ says money movement requires human confirmation. Marketing guarantees of perfect accuracy are not adopted.',
  },
  {
    id: 'finra',
    title: 'FINRA Regulatory Notice 24-09',
    url: 'https://www.finra.org/rules-guidance/notices/24-09',
    type: 'Regulatory guidance',
    date: '2024-06-27',
    supports: 'Existing obligations remain applicable to generative AI, including third-party use. The notice does not create new requirements.',
  },
  {
    id: 'sec-ai-claims',
    title: 'SEC settled charges against Delphia and Global Predictions',
    url: 'https://www.sec.gov/newsroom/press-releases/2024-36',
    type: 'Enforcement announcement',
    date: '2024-03-18',
    supports: 'False and misleading AI claims, USD 400,000 combined civil penalties, and settlement without admitting or denying the findings.',
  },
  {
    id: 'eu-ai-timetable',
    title: 'European Commission AI Act implementation',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    type: 'Official implementation guidance',
    supports: 'Current page reflects AI Omnibus changes, including 2 December 2027 for Annex III high-risk rules; different provisions have different dates.',
  },
  {
    id: 'dora',
    title: 'European Commission cyber resilience and DORA',
    url: 'https://finance.ec.europa.eu/digital-finance/cyber-resilience_en',
    type: 'Official regulatory explanation',
    supports: 'Operational resilience, disruption recovery, and oversight of critical technology providers.',
  },
  {
    id: 'rbi-digital-lending',
    title: 'Reserve Bank of India Digital Lending Directions, 2025',
    url: 'https://www.rbi.org.in/scripts/FS_Notification.aspx?Id=12848',
    type: 'Regulatory directions',
    date: '2025-05-08',
    supports: 'Covered regulated entities retain responsibility under paragraph 5(vii); borrower disclosure, data-consent and funds-flow requirements.',
  },
  {
    id: 'fsb-2026',
    title: 'Sound Practices for Responsible Adoption of Artificial Intelligence: Final report',
    url: 'https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/',
    type: 'International policy recommendations',
    date: '2026-10-15',
    supports: '12 sound practices covering governance and the AI lifecycle; recommendations rather than a universal deployment license.',
  },
  {
    id: 'finqa',
    title: 'FinQA dataset and evaluation code',
    url: 'https://github.com/czyssrs/FinQA',
    type: 'Research dataset',
    supports: 'Financial text, tables, questions, and reference calculations. No benchmark score is treated as evidence of payment execution.',
  },
  {
    id: 'fsb-2024',
    title: 'The Financial Stability Implications of Artificial Intelligence',
    url: 'https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/',
    type: 'Financial-stability assessment',
    date: '2024-11-14',
    supports: 'Third-party concentration, correlated behavior, cyber risks, and model and data weaknesses.',
  },
] as const;
