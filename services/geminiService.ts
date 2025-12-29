import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getTutorResponse = async (
  userPrompt: string,
  conversationHistory: string[]
): Promise<string> => {
  try {
    const systemInstruction = `
      You are a super friendly, enthusiastic, and patient math tutor named "Smarty Cat" (聪明猫) designed for a young girl named "Tangtang" (堂堂).
      
      Your Goal: Help Tangtang understand multiplication (1-9 table).
      
      Tone:
      - Use simple language suitable for a 6-9 year old.
      - Use lots of emojis (🐱, ⭐, 🍎, ✨).
      - Be encouraging and praise her effort.
      
      Capabilities:
      - Explain why 2x3 is the same as 2 groups of 3.
      - Tell short, funny stories to help memorize specific multiplication facts (e.g., for 7x8=56, make a rhyme or story).
      - If she asks unrelated questions, gently guide her back to math or fun logic puzzles.
      - Output mostly in Chinese as the user requested a multiplication table app for a Chinese context, but keep it simple.
      
      Format:
      - Keep responses relatively short (under 100 words) unless telling a specific story.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory.map(text => ({ role: 'user', parts: [{ text }] })), // Simplified history for context
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Oops! I fell asleep. Can you ask that again? 🐱";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My brain is taking a nap. Please try again later! (Check API Key)";
  }
};
