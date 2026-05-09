/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MoodValue } from "../types";

// Note: In Vite, we use process.env.GEMINI_API_KEY as configured in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMood(text: string): Promise<{ mood: MoodValue; weatherIcon: string; advice: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the mood of this journal entry and return a JSON object with:
      - mood: one of 'happy', 'calm', 'neutral', 'sad', 'tired', 'energetic'
      - weatherIcon: an emoji representing the climate of this mood (e.g. ☀️, 🌧️, ☁️, 🌩️)
      - advice: a short, kind sentence of advice based on the content.
      
      Entry: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, enum: ['happy', 'calm', 'neutral', 'sad', 'tired', 'energetic'] },
            weatherIcon: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["mood", "weatherIcon", "advice"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { mood: 'neutral', weatherIcon: '☁️', advice: 'Keep writing, every word counts.' };
  }
}

export async function generateWordCloud(entries: string[]): Promise<string[]> {
  try {
    const combinedText = entries.join(" ");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract the 10 most meaningful and frequent words from the following combined journal text. Return them as a JSON array of strings. Avoid common stop words like 'the', 'and', 'my'.
      
      Text: "${combinedText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Word cloud extraction failed:", error);
    return [];
  }
}
