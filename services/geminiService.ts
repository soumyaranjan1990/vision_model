
import { GoogleGenAI } from "@google/genai";
import { SceneInsight } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeScene(imageDataBase64: string, currentDetections: string): Promise<SceneInsight> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: `Analyze this edge vision feed. 
                Current low-level detections from NVIDIA Xavier: ${currentDetections}.
                Provide a high-level semantic summary, identify any safety anomalies or process inefficiencies, and suggest optimizations.` 
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageDataBase64,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              summary: { type: "STRING" },
              anomalies: { type: "ARRAY", items: { type: "STRING" } },
              recommendations: { type: "STRING" }
            },
            required: ["summary", "anomalies", "recommendations"]
          }
        },
      });

      const text = response.text || '{}';
      return JSON.parse(text) as SceneInsight;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return {
        summary: "Autonomous reasoning failed. Falling back to local edge heuristics.",
        anomalies: ["API connection latency detected"],
        recommendations: "Check system network link."
      };
    }
  }
}

export const geminiService = new GeminiService();
