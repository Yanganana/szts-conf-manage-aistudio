import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTaskSummary = async (tasks: Task[], contextName: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Unable to generate AI summary.";
  }

  try {
    const taskData = tasks.map(t => `- [${t.priority}] ${t.title} (${t.status})`).join('\n');
    
    const prompt = `
      Act as a senior project manager. Analyze the following list of tasks for the context: "${contextName}".
      
      Tasks:
      ${taskData}
      
      Provide a concise 3-sentence summary of the current state, highlighting any critical blockers or risks based on priority and status.
      Do not use markdown formatting like bolding, just plain text or simple bullets.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate summary at this time due to a network or configuration error.";
  }
};