import { generateImage } from '@/app/actions/generate-image';
import { tool } from 'ai';
import { z } from 'zod';

// TODO: Implement this tool to generate an image
const generateImageTool = tool({
  description: 'Use this tool to generate an image',
  inputSchema: z.object({
    prompt: z.string()
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    const image = await generateImage(prompt);
    return image;
  }
});


export { generateImageTool };
