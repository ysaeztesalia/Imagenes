import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, GroundingUrl } from "../types";

// Ensure we use the user-selected key for high-end models if available,
// otherwise fallback to env key (though logic dictates selecting key for Veo/Imagen models)
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductPrompt = async (
  data: ProductData
): Promise<{ prompt: string; sources: GroundingUrl[] }> => {
  const ai = getAI();
  
  // Using Gemini 3 Pro for complex reasoning and "Thinking" capability
  // Using Google Search tool for URL reading/grounding
  const modelId = "gemini-3-pro-preview";

  const parts: any[] = [];

  // System instruction to guide the persona
  const systemInstruction = `
    Eres un experto fotógrafo de productos y redactor de prompts para IA (Prompt Engineer). 
    Tu objetivo es crear un prompt altamente detallado y optimizado para generar una imagen de producto profesional para Mercado Libre.
    La imagen debe ser fotorrealista, con iluminación de estudio, fondo limpio (o contextual si mejora el producto), y mostrar el producto de la manera más atractiva posible.
    
    Reglas:
    1. Analiza la descripción, el enlace (si hay) y la imagen de referencia (si hay).
    2. Si hay un enlace, usa Google Search para extraer detalles técnicos y visuales del producto.
    3. Genera SOLAMENTE el texto del prompt en inglés (los modelos de imagen entienden mejor inglés).
    4. El prompt debe describir: Sujeto, Iluminación, Ángulo, Materiales, Estilo y Fondo.
    5. NO incluyas introducciones ni explicaciones, solo el prompt crudo.
  `;

  let userPrompt = "Genera un prompt para este producto:\n";
  if (data.description) userPrompt += `Descripción: ${data.description}\n`;
  if (data.url) userPrompt += `Enlace del producto: ${data.url}\n`;

  parts.push({ text: userPrompt });

  if (data.referenceImage && data.referenceMimeType) {
    parts.push({
      inlineData: {
        data: data.referenceImage,
        mimeType: data.referenceMimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        // High thinking budget for complex synthesis of inputs
        thinkingConfig: { thinkingBudget: 32768 }, 
        tools: [{ googleSearch: {} }],
      },
    });

    const promptText = response.text || "No se pudo generar el prompt.";
    
    // Extract grounding chunks if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingUrl[] = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title);

    return { prompt: promptText, sources };
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string> => {
  // Check for API key selection for premium image models
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
        if (typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
        }
    }
  }

  // Always create a new instance to grab the potentially selected key
  const ai = getAI();

  // Using Nano Banana Pro (Gemini 3 Pro Image) for high quality 1K images
  const modelId = "gemini-3-pro-image-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // Requirement: 1000x1000 pixels (1K, 1:1)
        imageConfig: {
          imageSize: "1K",
          aspectRatio: "1:1"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
