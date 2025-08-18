export interface QuickReply {
  title: string;
  query: string;
}

export const initialPrompts: QuickReply[] = [
  {
    title: "First Aid Tips",
    query: "What is the first aid tips for burns, cuts, choking?",
  },
  {
    title: "Healthy Diet Suggestions",
    query: "Can you suggest a healthy diet plan for weight loss?",
  },
  {
    title: "Give Common Cold Symptoms",
    query: "What are the symptoms of the common cold?",
  },
  {
    title: "Tips for Managing Stress",
    query: "What are some effective tips for managing stress?",
  },
];