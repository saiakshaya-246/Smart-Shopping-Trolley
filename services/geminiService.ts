
import { GoogleGenAI, Type } from "@google/genai";
import { TrolleyItem } from "../types";

export const getSmartSuggestions = async (items: TrolleyItem[]) => {
  const activeItems = items.filter(i => i.status === 'Scanned');
  if (activeItems.length === 0) return "Add some items to your trolley to get smart recipe suggestions!";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const itemNames = activeItems.map(i => i.name).join(', ');

  const prompt = `I have the following items in my shopping trolley: ${itemNames}. 
  Suggest 2-3 quick recipes I can make with these or mention 1-2 items I might be missing to complete a popular dish. 
  Keep it concise and formatted for a dashboard UI.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "No suggestions available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not load smart suggestions. Check your internet connection.";
  }
};
