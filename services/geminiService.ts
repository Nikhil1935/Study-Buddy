
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, QuizQuestion } from "../types";

// Initialize Gemini Client
// process.env.API_KEY is guaranteed to be available by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = "gemini-3-pro-preview";
const FAST_MODEL = "gemini-2.5-flash";

/**
 * Analyzes the user's question to provide a conceptual breakdown.
 */
export const analyzeQuestion = async (userQuestion: string): Promise<AnalysisResult> => {
  const prompt = `
    You are an expert academic tutor for IIT Madras students studying Data Science and Programming.
    Analyze the following question: "${userQuestion}".
    
    1. Identify the core academic concept (e.g., "Bayes' Theorem", "Dynamic Programming", "Linear Regression").
    2. Provide a detailed, step-by-step conceptual breakdown. Do NOT simply give the final answer. Explain the *why* and *how* using clear, academic language. Use Markdown for formatting (bold, lists, code blocks).

    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            explanationMarkdown: { type: Type.STRING },
          },
          required: ["concept", "explanationMarkdown"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing question:", error);
    throw new Error("Failed to analyze the question. Please try again.");
  }
};

/**
 * Generates a practice quiz question based on the concept.
 */
export const generateQuizQuestion = async (concept: string, originalQuestion: string): Promise<QuizQuestion> => {
  const prompt = `
    Generate a multiple-choice practice question to test the student's understanding of "${concept}".
    The question should be similar in difficulty to: "${originalQuestion}".
    
    Return JSON format with:
    - question (string)
    - options (array of 4 strings)
    - correctOptionIndex (integer 0-3)
    - explanation (string: brief explanation of why the correct answer is right)
  `;

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOptionIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctOptionIndex", "explanation"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as QuizQuestion;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz.");
  }
};

/**
 * Generates a code hint for the sandbox.
 */
export const getCodeHint = async (question: string, code: string, concept: string): Promise<string> => {
  const prompt = `
    You are an academic tutor helping a student with a programming exercise.
    Concept: ${concept}
    Question: ${question}
    
    Student's Code:
    ${code}
    
    Provide a concise hint (max 2 sentences) to guide the student. Focus on the next logical step or correcting a mistake. Do not give the full solution.
  `;

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
    });

    return response.text || "Check your logic and syntax.";
  } catch (error) {
    console.error("Hint generation error:", error);
    return "Unable to generate hint.";
  }
};
