import { GoogleGenAI } from "@google/genai";
import { TrolleyItem } from "../types";

export const getSmartSuggestions = async (
  items: TrolleyItem[]
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return "❌ API key missing.";
    }

    const activeItems = items.filter(
      (item) => item.status === "Scanned"
    );

    if (activeItems.length === 0) {
      return "🛒 Add items to your trolley to get AI suggestions.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const itemNames = activeItems
      .map((item) => item.name)
      .join(", ");

    const prompt = `
You are an AI Shopping Assistant for a Smart Trolley.

Customer's trolley contains:
${itemNames}

Generate shopping suggestions in Markdown.

Use EXACTLY this format:

**Alternative Products**
- Suggest 2 cheaper or healthier alternatives.
- Explain each in one sentence.

**Smart Promotions**
- Suggest 2 complementary products or bundle offers.
- Explain why they pair well.

**Cost Savings**
- Suggest 2 or 3 practical ways to save money.

Rules:
- Start EVERY point with "- ".
- Use bullet points only.
- Keep each point under 25 words.
- Don't use tables.
- Don't add introductions or conclusions.
- Return only the formatted Markdown.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text ?? "No suggestions available.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "⚠️ AI suggestions are currently unavailable.";
  }
};