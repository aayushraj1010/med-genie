import { EmergencyRule, Severity } from "./emergency-types";

export const EMERGENCY_RULES: EmergencyRule[] = [
  {
    category: "cardiac",
    severity: Severity.CRITICAL,
    patterns: [
      /\bchest pain\b/i,
      /\bheart attack\b/i,
      /\bchest pressure\b/i,
      /\btightness in chest\b/i,
      /\bcrushing chest pain\b/i,
    ],
  },

  {
    category: "breathing",
    severity: Severity.CRITICAL,
    patterns: [
      /\bcan't breathe\b/i,
      /\bcannot breathe\b/i,
      /\bdifficulty breathing\b/i,
      /\bshortness of breath\b/i,
      /\bgasping\b/i,
      /\bchoking\b/i,
      /\bnot breathing\b/i,
    ],
  },

  {
    category: "neurological",
    severity: Severity.CRITICAL,
    patterns: [
      /\bstroke\b/i,
      /\bseizure\b/i,
      /\bconvulsion\b/i,
      /\bunconscious\b/i,
      /\bunresponsive\b/i,
      /\bnot responding\b/i,
      /\bpassed out\b/i,
      /\bcollapsed\b/i,
    ],
  },

  {
    category: "bleeding",
    severity: Severity.CRITICAL,
    patterns: [
      /\bsevere bleeding\b/i,
      /\bbleeding heavily\b/i,
      /\bhemorrhage\b/i,
      /\bwon'?t stop bleeding\b/i,
    ],
  },

  {
    category: "trauma",
    severity: Severity.CRITICAL,
    patterns: [
      /\bmajor accident\b/i,
      /\bcar crash\b/i,
      /\broad accident\b/i,
      /\bserious injury\b/i,
      /\bhead injury\b/i,
      /\bfall from height\b/i,
    ],
  },

  {
    category: "poisoning",
    severity: Severity.CRITICAL,
    patterns: [
      /\boverdose\b/i,
      /\bpoisoning\b/i,
      /\bpoisoned\b/i,
      /\btoxic exposure\b/i,
      /\bswallowed poison\b/i,
    ],
  },

  {
    category: "allergic",
    severity: Severity.CRITICAL,
    patterns: [
      /\banaphylaxis\b/i,
      /\bsevere allergic reaction\b/i,
      /\bthroat swelling\b/i,
      /\btongue swelling\b/i,
    ],
  },

  {
    category: "burn",
    severity: Severity.CRITICAL,
    patterns: [
      /\bsevere burn\b/i,
      /\bthird degree burn\b/i,
      /\belectrical burn\b/i,
      /\bchemical burn\b/i,
    ],
  },

  {
    category: "pregnancy",
    severity: Severity.CRITICAL,
    patterns: [
      /\bsevere pregnancy bleeding\b/i,
      /\blabor complications\b/i,
      /\bectopic pregnancy\b/i,
    ],
  },

  {
    category: "mental_health",
    severity: Severity.CRITICAL,
    patterns: [
      /\bsuicidal\b/i,
      /\bwant to kill myself\b/i,
      /\bsuicide attempt\b/i,
      /\bself harm\b/i,
    ],
  },
];