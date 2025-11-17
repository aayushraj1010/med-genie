import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Tool } from "@langchain/core/tools";

export const searchTool = new DuckDuckGoSearch({ maxResults: 3 });

export class CalculatorTool extends Tool {
  name = "calculator";
  description = "Useful for BMI, dosage, age, medicine quantity calculations";
  async _call(input: string): Promise<string> {
    try {
      // eslint-disable-next-line no-eval
      return `Answer: ${eval(input)}`;
    } catch {
      return "Invalid calculation";
    }
  }
}

export const calculatorTool = new CalculatorTool();