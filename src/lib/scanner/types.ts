export type CheckStatus = 'pass' | 'warning' | 'fail' | 'na';
export type CheckImpact = 'critical' | 'important' | 'recommended' | 'optional';
export type LayerId = 'discovery' | 'access' | 'usability' | 'security' | 'seo' | 'payments';

export interface CheckResult {
  id: string;
  name: string;
  layer: LayerId;
  status: CheckStatus;
  score: number;
  maxScore: number;
  /** What the scanner actually found (factual, specific to this domain). */
  details: string;
  /** Why this check matters for AI agents, LLMs, and machine consumers — educational context. */
  why?: string;
  /** What to do to fix or improve this check. */
  recommendation?: string;
  /** Copy-paste code snippet to implement the fix. */
  fixSnippet?: {
    language: string;
    filename?: string;
    code: string;
  };
  /** Priority level for this check. */
  impact?: CheckImpact;
  /** Link to full guide or spec. */
  referenceUrl?: string;
}

export interface LayerScore {
  id: LayerId;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  percentage: number;
  checks: CheckResult[];
}

export interface ScanResult {
  url: string;
  domain: string;
  scannedAt: string;
  durationMs: number;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  layers: LayerScore[];
  badges: {
    mcpServer: boolean;
    llmsTxt: boolean;
    ardCatalog: boolean;
    markdownTwins: boolean;
    openapiSpec: boolean;
    aiBotFriendly: boolean;
    httpsSecure: boolean;
    structuredData: boolean;
  };
}
