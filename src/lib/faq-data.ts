export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "What is Med Genie?",
    answer:
      "Med Genie is an AI-powered health assistant that helps you with basic medical queries, emergency guidance, and symptom-based suggestions — all through natural conversation.",
  },
  {
    question: "Is Med Genie a replacement for a doctor?",
    answer:
      "No. Med Genie is designed for basic guidance and quick information. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified doctor for medical concerns.",
  },
  {
    question: "Does Med Genie store my data?",
    answer:
      "No. Med Genie is privacy-first — it does not store, track, or share any personal health data.",
  },
  {
    question: "Can Med Genie help in emergencies?",
    answer:
      "Yes. Med Genie can provide you with emergency contact numbers, hospital information, and basic first-aid tips, but it cannot replace urgent medical services. Always call emergency services if needed.",
  },
  {
    question: "What features does Med Genie offer?",
    answer:
      "You can chat in multiple languages (upcoming), check symptoms, get health tips, use voice input, and toggle between dark/light themes for better accessibility.",
  },
  {
    question: "Is Med Genie free to use?",
    answer:
      "Yes! Med Genie is free for everyone. All features are available without any subscription or hidden costs.",
  },
];
