export type CheckStatus = 'pass' | 'warning' | 'fail' | 'na';

export type LayerId = 'discovery' | 'access' | 'usability' | 'security' | 'seo' | 'payments';

export interface CheckResult {
  id: string;
  name: string;
  layer: LayerId;
  status: CheckStatus;
  score: number;
  maxScore: number;
  details: string;
  recommendation?: string;
  fixSnippet?: {
    language: string;
    filename?: string;
    code: string;
  };
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
