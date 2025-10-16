"use server";

import { generateImageToolPrompt } from "@/ai/prompts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export async function generateImage(prompt: string) {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-preview-image-generation'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] }
      },
      messages: [
        {
          role: 'user',

          parts: [{
            type: 'text',
            text: generateImageToolPrompt(prompt)
          }]
        }
      ]
    });
    
    const image = result.files[0];
    return image;
  } catch (error) {
    console.error('Error generating image:', error);
    return { status: 500,error: 'Failed to generate image' };
  }
}