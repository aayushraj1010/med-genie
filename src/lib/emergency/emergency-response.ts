import { Severity } from "./emergency-types";
export function getEmergencyResponse(
  category?: string,
  severity?: Severity,
): string {
  switch (category) {
    case "cardiac":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible cardiac emergency.

Immediate Actions:
• Call emergency services immediately.
• Sit down and rest.
• Loosen tight clothing.
• Do not drive yourself.
• Seek emergency medical care immediately.

📞 Emergency Number: 112
`;

    case "breathing":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible breathing emergency.

Immediate Actions:
• Call emergency services immediately.
• Ensure the airway is clear.
• Help the person sit upright.
• If choking, provide first aid if trained.
• Begin CPR if the person stops breathing.

📞 Emergency Number: 112
`;

    case "neurological":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible stroke, seizure, or loss of consciousness.

Immediate Actions:
• Call emergency services immediately.
• Note the time symptoms began.
• Do not give food or drink.
• Protect the person from injury.
• Place unconscious but breathing individuals in the recovery position.

📞 Emergency Number: 112
`;

    case "bleeding":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Severe bleeding suspected.

Immediate Actions:
• Apply firm direct pressure.
• Elevate the injured area if possible.
• Do not remove blood-soaked dressings.
• Continue pressure until help arrives.

📞 Emergency Number: 112
`;

    case "trauma":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Serious injury suspected.

Immediate Actions:
• Call emergency services immediately.
• Avoid moving the injured person.
• Monitor breathing and consciousness.
• Control severe bleeding if present.

📞 Emergency Number: 112
`;

    case "poisoning":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible poisoning or overdose.

Immediate Actions:
• Call emergency services immediately.
• Keep medication containers nearby.
• Do not induce vomiting unless instructed.
• Monitor breathing and responsiveness.

📞 Emergency Number: 112
`;

    case "allergic":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible severe allergic reaction.

Immediate Actions:
• Call emergency services immediately.
• Use an epinephrine auto-injector if available.
• Monitor breathing closely.

📞 Emergency Number: 112
`;

    case "burn":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Serious burn injury suspected.

Immediate Actions:
• Cool with clean running water.
• Do not apply ice or creams.
• Cover with a clean cloth.

📞 Emergency Number: 112
`;

    case "pregnancy":
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Possible pregnancy-related emergency.

Immediate Actions:
• Seek urgent obstetric care.
• Call emergency services immediately.
• Monitor symptoms and bleeding.

📞 Emergency Number: 112
`;

    case "mental_health":
      return `
🚨 MENTAL HEALTH CRISIS DETECTED

Severity: ${severity}

Immediate Actions:
• Contact emergency services immediately if there is immediate danger.
• Stay with the person if safe.
• Remove access to harmful objects.
• Seek urgent professional assistance.

📞 Emergency Number: 112
`;

    default:
      return `
🚨 MEDICAL EMERGENCY DETECTED

Severity: ${severity}

Call emergency services immediately and seek urgent medical care.

📞 Emergency Number: 112
`;
  }
}