import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTaskSummary = async (tasks: Task[], contextName: string): Promise<string> => {
  if (!apiKey) {
    return "API Key 缺失。无法生成 AI 摘要。";
  }

  try {
    const taskData = tasks.map(t => `- [${t.priority}] ${t.title} (${t.status})`).join('\n');
    
    const prompt = `
      你是一位资深的项目经理。请根据以下任务列表分析 "${contextName}" 的当前状态。
      
      任务列表:
      ${taskData}
      
      请用中文提供一段简明扼要的 3 句话总结，基于任务的优先级和状态，重点指出任何严重的阻塞点或风险。
      不要使用 Markdown 格式（如加粗），仅使用纯文本。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "未生成摘要。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "由于网络或配置错误，暂时无法生成摘要。";
  }
};