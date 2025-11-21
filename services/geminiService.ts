import { GoogleGenAI, Type } from "@google/genai";
import { KnapsackItem, GeminiExplanation } from '../types';

const apiKey = process.env.API_KEY;

// Initialize only if key exists, though error handling will manage missing keys gracefully in UI
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getKnapsackExplanation = async (
  items: KnapsackItem[], 
  capacity: number, 
  totalValue: number, 
  selectedItems: KnapsackItem[]
): Promise<GeminiExplanation> => {
  
  if (!ai) {
    return {
      summary: "API Key missing. Please configure the environment to see AI insights.",
      strategyAnalysis: "N/A",
      realWorldAnalogy: "N/A"
    };
  }

  const prompt = `
    I have solved a 0/1 Knapsack Problem.
    Constraints:
    - Max Capacity: ${capacity}
    - Total Items Available: ${items.length}
    
    Items List (Name, Weight, Value):
    ${items.map(i => `- ${i.name}: W=${i.weight}, V=${i.value}`).join('\n')}
    
    Result:
    - Optimal Total Value: ${totalValue}
    - Selected Items: ${selectedItems.map(i => i.name).join(', ')}
    
    Please provide a structured educational explanation for a Master's student in Data Analytics.
    1. Summary: Briefly explain why this specific combination is optimal.
    2. Strategy Analysis: Discuss the trade-offs (e.g., did we pick high-density items? did we fill the capacity perfectly?).
    3. Real World Analogy: Create a short, vivid real-world scenario where this specific optimization would apply (e.g., cargo loading, investment portfolio).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strategyAnalysis: { type: Type.STRING },
            realWorldAnalogy: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiExplanation;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Could not generate explanation at this time.",
      strategyAnalysis: "Please check your network connection or API limits.",
      realWorldAnalogy: "Optimization is like packing a suitcase: sometimes you leave the heavy boots to fit more shirts."
    };
  }
};