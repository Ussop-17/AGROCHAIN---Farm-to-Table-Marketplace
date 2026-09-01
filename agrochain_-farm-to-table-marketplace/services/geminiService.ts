
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProduceDescription = async (name: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, enticing marketing description (2 sentences) for fresh ${name} (${category}) listed on a farmer's marketplace. Focus on freshness and quality.`,
    });
    return response.text || "Freshly harvested produce straight from our farm to your table.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "High-quality farm-fresh produce ready for delivery.";
  }
};

export const suggestDeliveryPricing = async (distanceKm: number, weightKg: number): Promise<number> => {
  // Simple heuristic but could be AI-driven
  const baseRate = 5;
  const kmRate = 1.5;
  const weightRate = 0.5;
  return Number((baseRate + (distanceKm * kmRate) + (weightKg * weightRate)).toFixed(2));
};
