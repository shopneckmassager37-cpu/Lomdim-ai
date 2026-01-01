
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Grade, Question, StudyTopic, TestPrepPlan, HistoryItem, HistoryAnalysis, TestPrepDay, EnrolledCourse, DailyLesson, ClassroomMaterial } from "../types.ts";
import { STATIC_RESOURCES } from "./resourcesData.ts";
import { COURSES_DB } from "./courseData.ts";

const LATEX_INSTRUCTION = `
MATHEMATICAL FORMATTING RULES:
1. Use LaTeX for ALL mathematical notation.
2. Use $...$ for inline math and $$...$$ for block math.
3. IMPORTANT: When writing fractions, powers, or square roots, ensure they are correctly formatted in LaTeX.
4. For Hebrew text inside math blocks, use \\text{...}.
5. Use DOUBLE backslashes in JSON strings (e.g., "\\\\frac{a}{b}").
`;

const MARKDOWN_INSTRUCTION = `
CONTENT RULES:
1. Language: Hebrew (עברית).
2. Use professional, educational, and encouraging tone.
3. Use Markdown for structuring (headers, lists, bold text).
4. For science and math, explain steps clearly.
5. SPACING: Be extremely concise with whitespace. DO NOT use empty lines between list items. Use EXACTLY one empty line between different headers and paragraphs. Eliminate any redundant "Enters".
6. DEPTH: Provide rich, dense content without wasting space on repetitive intros.
`;

const historyAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    insight: { type: Type.STRING, description: "תובנה כללית על ההתקדמות" },
    strength: { type: Type.STRING, description: "נקודת חוזק בולטת של התלמיד" },
    weakness: { type: Type.STRING, description: "נקודה שדורשת שיפור או תרגול נוסף" },
    recommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 המלצות מעשיות להמשך"
    }
  },
  required: ["insight", "strength", "weakness", "recommendations"]
};

const testPrepSchema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          summary: { type: Type.STRING, description: "Detailed, long summary of the material for this day. Use clean markdown." },
          videoSearchTerm: { type: Type.STRING },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["text", "options", "correctIndex", "explanation"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              },
              required: ["front", "back"]
            }
          },
          conceptMap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                from: { type: Type.STRING },
                to: { type: Type.STRING },
                relation: { type: Type.STRING }
              },
              required: ["from", "to", "relation"]
            }
          }
        },
        required: ["dayNumber", "title", "summary", "quiz", "flashcards", "conceptMap", "videoSearchTerm"]
      }
    }
  },
  required: ["days"]
};

export const generateTestPrepPlan = async (
  subject: Subject,
  grade: Grade,
  topic: string,
  daysCount: number,
  attachment?: { mimeType: string; data: string }
): Promise<TestPrepPlan | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    let prompt = `Create a comprehensive and detailed ${daysCount}-day prep plan for ${grade} in ${subject}. Topic: ${topic || 'General study'}. 
    Ensure the "summary" field for each day is long and exhaustive, covering all necessary points without redundant spacing.
    ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}`;

    const parts: any[] = [{ text: prompt }];
    if (attachment) {
      parts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }],
      config: { 
        responseMimeType: "application/json", 
        responseSchema: testPrepSchema
      }
    });

    const cleanText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText || '{}');
    return {
      id: Date.now().toString(),
      subject,
      targetTopic: topic || 'תוכנית למידה אישית',
      totalDays: daysCount,
      days: data.days.map((day: any, i: number) => ({
          ...day,
          quiz: day.quiz.map((q: any, j: number) => ({ ...q, id: `tpq-${i}-${j}` }))
      })),
      createdAt: Date.now(),
      completedDays: []
    };
  } catch (error) {
    return null;
  }
};

export const generateSummary = async (subject: Subject, grade: Grade, topic: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    const prompt = `Generate a very detailed and long study summary for "${topic}" (${grade} ${subject}). 
    Cover all aspects, definitions, and important examples. 
    FORMATTING: Use clean, structured markdown with minimal whitespace.
    ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}`;
    
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: prompt 
    });
    return response.text || "לא ניתן היה לייצר סיכום.";
  } catch (e) { return "שגיאה בייצור הסיכום."; }
};

export const generateAssignment = async (subject: Subject, grade: Grade, topic: string): Promise<Partial<ClassroomMaterial>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    const prompt = `Create a comprehensive interactive learning assignment for "${topic}" (${grade}, ${subject}). 
    Include a detailed, long summary, 4 flashcards, and 4 multiple choice questions.
    ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["text", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["summary", "flashcards", "quiz"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      content: data.summary,
      flashcards: data.flashcards,
      questions: data.quiz.map((q: any, i: number) => ({ ...q, id: `aq-${Date.now()}-${i}` }))
    };
  } catch (e) {
    throw new Error("Failed to generate assignment");
  }
};

export const generateQuestions = async (
  subject: Subject, 
  grade: Grade, 
  topic?: string, 
  previousMistakes?: string[], 
  count: number = 5, 
  difficulty: 'MEDIUM' | 'HARD' = 'MEDIUM',
  mcqCount?: number,
  openCount?: number
): Promise<Question[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    let typeInstructions = `Generate ${count} questions.`;
    if (mcqCount !== undefined && openCount !== undefined) {
      typeInstructions = `Generate exactly ${mcqCount} Multiple Choice Questions (type: 'MCQ') and ${openCount} Open-Ended Questions (type: 'OPEN'). Total: ${mcqCount + openCount} questions.`;
    }

    const prompt = `Generate questions for ${subject}, ${grade}. Topic: ${topic || 'General'}. 
    ${typeInstructions}
    Difficulty: ${difficulty}.
    CRITICAL: For MCQ, RANDOMIZE the position of the correct answer. The 'correctIndex' MUST match the correct option.
    For OPEN questions, provide a 'modelAnswer' and set 'options' to an empty array.
    ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}`;

    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: prompt, 
      config: { 
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              text: { type: Type.STRING }, 
              type: { type: Type.STRING, enum: ["MCQ", "OPEN"] },
              options: { type: Type.ARRAY, items: { type: Type.STRING } }, 
              correctIndex: { type: Type.INTEGER }, 
              modelAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING } 
            }, 
            required: ["text", "type", "options", "explanation"] 
          } 
        } 
      } 
    });
    const cleanText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText || '[]').map((q: any, i: number) => ({ ...q, id: `q-${Date.now()}-${i}` }));
  } catch (e) { return []; }
};

export const getStudyTopics = async (subject: Subject, grade: Grade): Promise<{summaries: StudyTopic[], tests: StudyTopic[]}> => {
  const filtered = (STATIC_RESOURCES[subject] || []).filter(resource => resource.grades.includes(grade));
  const topics = filtered.length > 0 ? filtered : (STATIC_RESOURCES[subject] || []).slice(0, 4);

  return {
    summaries: topics.map(t => ({ title: t.title, description: t.description, type: 'SUMMARY' })),
    tests: topics.map(t => ({ title: t.title, description: "מבחן תרגול מקיף", type: 'TEST' }))
  };
};

export const analyzeHistory = async (history: HistoryItem[]): Promise<HistoryAnalysis | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    const prompt = `Analyze this student's learning history: ${JSON.stringify(history.slice(-20))}. 
    Based on their performance and study topics, return a helpful JSON analysis in Hebrew.
    Ensure 'strength' and 'weakness' fields are populated with specific pedagogical insights.
    ${LATEX_INSTRUCTION}`;
    
    const response = await ai.models.generateContent({ 
      model: 'gemini-3-flash-preview', 
      contents: prompt, 
      config: { 
        responseMimeType: "application/json",
        responseSchema: historyAnalysisSchema
      } 
    });
    
    const text = response.text;
    if (!text) return null;
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) { 
    console.error("Analysis Error:", e);
    return null; 
  }
}

export const getChatResponseStream = async (history: any[], message: string, subject: Subject, grade: Grade, attachment?: any) => {
  const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
  const chat = ai.chats.create({ 
    model: 'gemini-3-flash-preview', 
    history, 
    config: { 
      systemInstruction: `You are a helpful and expert Hebrew tutor for ${grade} in ${subject}. 
      ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}` 
    } 
  });
  const messageInput = attachment ? { parts: [{ text: message }, { inlineData: attachment }] } : message;
  return await chat.sendMessageStream({ message: messageInput });
};

export const generateLessonContent = async (subject: Subject, grade: Grade, courseTitle: string, day: number): Promise<DailyLesson> => {
  try {
    const ai = new GoogleGenAI({ apiKey: (globalThis as any).process?.env?.API_KEY || '' });
    const prompt = `Write Lesson Day ${day} for "${courseTitle}" (${grade}, ${subject}). 
    ${LATEX_INSTRUCTION} ${MARKDOWN_INSTRUCTION}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            videoSearchTerm: { type: Type.STRING },
            funFact: { type: Type.STRING },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER }
              },
              required: ["question", "options", "correctIndex"]
            }
          },
          required: ["title", "content", "videoSearchTerm", "funFact", "quiz"]
        }
      }
    });
    const cleanText = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText || '{}');
  } catch (error) {
    return { title: "שגיאה", content: "אירעה שגיאה.", videoSearchTerm: "", funFact: "", quiz: { question: "", options: [], correctIndex: 0 } };
  }
};

export const getCourseTopics = async (subject: Subject, grade: Grade): Promise<StudyTopic[]> => {
  const courses = COURSES_DB[subject] || [];
  return courses.map(c => ({ title: c.title, description: c.description, type: 'SUMMARY' }));
};
