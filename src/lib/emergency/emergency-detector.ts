import { EMERGENCY_RULES } from "./emergency-config";
import {
  EmergencyDetectionResult,
  Severity,
} from "./emergency-types";

export function detectEmergency(
  text: string
): EmergencyDetectionResult {
  const query = text.toLowerCase();

  for (const rule of EMERGENCY_RULES) {
    const matches = rule.patterns.filter((pattern) =>
      pattern.test(query)
    );

    if (matches.length > 0) {
      return {
        isEmergency: true,
        severity: rule.severity,
        category: rule.category,
        confidence: Math.min(
          0.6 + matches.length * 0.1,
          1
        ),
      };
    }
  }

  return {
    isEmergency: false,
    severity: Severity.LOW,
    confidence: 0,
  };
}
console.log(detectEmergency("I have severe chest pain"));
console.log(detectEmergency("Someone is unconscious"));
console.log(detectEmergency("I am bleeding heavily"));
console.log(detectEmergency("I have a headache"));