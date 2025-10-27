"use server";

import { generateImageToolPrompt } from "@/ai/prompts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, UserModelMessage } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export async function generateImage(prompt: string) {
  try {

    const message = {
      role: 'user',
      content: generateImageToolPrompt(prompt)
    } as UserModelMessage;

    const result = await generateText({
      model: google('gemini-2.0-flash-preview-image-generation'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] }
      },
      messages: [message]
    });

    const image = result.files[0];
    return image;
  } catch (error) {
    console.error('Error generating image:', error);
    return { status: 500, error: 'Failed to generate image' };
  }
}