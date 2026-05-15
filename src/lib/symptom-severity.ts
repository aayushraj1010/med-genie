export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomSeverityResult {
  severity: SymptomSeverity;
  redFlagSymptoms: string[];
}

const RED_FLAG_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'chest pain', pattern: /\bchest pain\b/i },
  { label: 'shortness of breath', pattern: /\b(shortness of breath|difficulty breathing|cant breathe|cannot breathe)\b/i },
  { label: 'stroke symptoms', pattern: /\b(face drooping|slurred speech|arm weakness|stroke)\b/i },
  { label: 'seizure', pattern: /\bseizure\b/i },
  { label: 'loss of consciousness', pattern: /\b(fainted|fainting|unconscious|passed out)\b/i },
  { label: 'severe bleeding', pattern: /\b(severe bleeding|heavy bleeding|bleeding wont stop|bleeding won't stop)\b/i },
  { label: 'severe allergic reaction', pattern: /\b(anaphylaxis|severe allergic reaction|throat swelling)\b/i },
  { label: 'suicidal thoughts', pattern: /\b(suicidal|want to die|self harm)\b/i },
];

const MODERATE_PATTERNS: RegExp[] = [
  /\bfever\b/i,
  /\bvomi(t|ting)\b/i,
  /\bdiarrhea\b/i,
  /\binfection\b/i,
  /\bsevere pain\b/i,
  /\bpersistent\b/i,
  /\bworsening\b/i,
  /\bhigh blood pressure\b/i,
];

export function classifySymptomSeverity(input: string): SymptomSeverityResult {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    return {
      severity: 'mild',
      redFlagSymptoms: [],
    };
  }

  const redFlagSymptoms = RED_FLAG_PATTERNS
    .filter(({ pattern }) => pattern.test(normalizedInput))
    .map(({ label }) => label);

  if (redFlagSymptoms.length > 0) {
    return {
      severity: 'severe',
      redFlagSymptoms,
    };
  }

  const hasModerateSignal = MODERATE_PATTERNS.some((pattern) => pattern.test(normalizedInput));

  return {
    severity: hasModerateSignal ? 'moderate' : 'mild',
    redFlagSymptoms: [],
  };
}
