
import { GoogleGenAI } from "@google/genai";
import { Project } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getProjectHealthInsight = async (project: Project): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following project status and provide a concise (2-sentence) professional executive summary on its health.
      
      Project: ${project.name}
      Category: ${project.category}
      Budget: ${project.totalBudget}
      Expenditure: ${project.expenditure}
      Status: ${project.status}
      Remarks: ${project.delayRemarks || 'None'}
      Milestones: ${JSON.stringify(project.milestones)}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Unable to generate insight at this time.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Insight generation currently unavailable.";
  }
};
