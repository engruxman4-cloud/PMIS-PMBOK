import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Stakeholder, CommRequirement, CommIssue, EngagementLevel } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const extractStakeholdersFromText = async (text: string): Promise<Stakeholder[]> => {
  const ai = getAIClient();
  
  const prompt = `
    Analyze the following project text/charter/notes and identify all stakeholders.
    
    For each stakeholder found:
    1. Extract their Name and Role.
    2. Infer their 'Power' (High/Low) and 'Interest' (High/Low) based on their title and involvement.
    3. Infer their 'Current Engagement' level (Unaware, Resistant, Neutral, Supportive, Leading) based on the context.
    4. Set a logical 'Desired Engagement' level.
    
    TEXT TO ANALYZE:
    "${text}"
    
    Return a valid JSON array.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        role: { type: Type.STRING },
        currentEngagement: { type: Type.STRING, enum: Object.values(EngagementLevel) },
        desiredEngagement: { type: Type.STRING, enum: Object.values(EngagementLevel) },
        power: { type: Type.STRING, enum: ['High', 'Low'] },
        interest: { type: Type.STRING, enum: ['High', 'Low'] },
      },
      required: ["name", "role", "currentEngagement", "desiredEngagement", "power", "interest"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const data = JSON.parse(response.text || "[]");
    // Ensure IDs are unique client-side
    return data.map((s: any, i: number) => ({ ...s, id: `extracted-${Date.now()}-${i}` }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const generateCommPlanStrategy = async (stakeholders: Stakeholder[]): Promise<Partial<CommRequirement>[]> => {
  const ai = getAIClient();
  
  const prompt = `
    As a PMP-certified Project Manager, analyze the following stakeholders and recommend a communication strategy (Info Needed, Format, Frequency, Channel).
    Stakeholders: ${JSON.stringify(stakeholders.map(s => ({ name: s.name, role: s.role, power: s.power, interest: s.interest })))}
    
    Provide specific, professional recommendations suitable for a Communications Management Plan (PMBOK 5.3).
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        stakeholderName: { type: Type.STRING },
        infoNeeded: { type: Type.STRING },
        format: { type: Type.STRING },
        frequency: { type: Type.STRING },
        channel: { type: Type.STRING },
      },
      required: ["stakeholderName", "infoNeeded", "format", "frequency", "channel"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const analyzeEngagementGaps = async (stakeholders: Stakeholder[]): Promise<{ analysis: string; actions: string[] }> => {
  const ai = getAIClient();
  
  const prompt = `
    Perform a Stakeholder Engagement Assessment (PMBOK 5.6). 
    Identify gaps between Current and Desired engagement levels for the following stakeholders:
    ${JSON.stringify(stakeholders)}
    
    1. Summarize the overall engagement health.
    2. Provide a list of specific corrective actions to close the gaps.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      analysis: { type: Type.STRING, description: "Executive summary of engagement gaps." },
      actions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of actionable steps to improve engagement." 
      }
    },
    required: ["analysis", "actions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || '{"analysis": "Analysis failed", "actions": []}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const evaluateCommunicationPerformance = async (issues: CommIssue[]): Promise<{ score: number; feedback: string; improvements: string[] }> => {
  const ai = getAIClient();

  const prompt = `
    Evaluate the project's Communication Performance (PMBOK 5.7) based on this issue log:
    ${JSON.stringify(issues)}
    
    Calculate a simulated 'Performance Score' (0-100), provide qualitative feedback, and suggest process improvements.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      feedback: { type: Type.STRING },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["score", "feedback", "improvements"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || '{"score": 0, "feedback": "Error", "improvements": []}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};