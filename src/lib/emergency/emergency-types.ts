export enum Severity {
  LOW = "LOW",
  URGENT = "URGENT",
  CRITICAL = "CRITICAL",
}

export interface EmergencyDetectionResult {
  isEmergency: boolean;
  severity: Severity;
  category?: string;
}

export interface EmergencyRule {
  category: string;
  severity: Severity;
  patterns: RegExp[];
}