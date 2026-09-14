export type RiskLevel =
  | "SAFE"
  | "LOW_RISK"
  | "SUSPICIOUS"
  | "HIGH_RISK"
  | "MALICIOUS"
  | "UNKNOWN";

export type SecurityAction = "ALLOW" | "WARN" | "BLOCK" | "QUARANTINE";

export interface RedirectHop {
  hop: number;
  url: string;
  status: number;
  ip?: string;
  country?: string;
}

export interface ThreatSignal {
  id: string;
  title: string;
  description: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  category: "domain" | "url_structure" | "redirect" | "ssl" | "phishing" | "malware";
}

export interface SecurityAnalysisResult {
  scanId: string;
  timestamp: string;
  rawPayload: string;
  sanitizedUrl: string;
  domain: string;
  ipAddress?: string;
  geoCountry?: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  action: SecurityAction;
  reputation: "CLEAN" | "SUSPICIOUS" | "MALICIOUS" | "UNKNOWN";
  httpsStatus: "VALID" | "INVALID" | "MISSING";
  sslIssuer?: string;
  redirectsCount: number;
  redirectChain: RedirectHop[];
  domainAgeDays: number;
  entropyScore: number;
  threatSignals: ThreatSignal[];
  aiAnalysisSummary: string;
  recommendedAction: string;
  isMock: boolean;
  webhookTriggered?: boolean;
}

export interface ScanRequest {
  payload: string;
  useWebhook?: boolean;
  simulateLatency?: boolean;
}

export interface PresetPayload {
  id: string;
  title: string;
  category: string;
  payload: string;
  badge: string;
  badgeColor: string;
  riskScore: number;
  riskLevel: RiskLevel;
  description: string;
  qrSvgData?: string;
}
