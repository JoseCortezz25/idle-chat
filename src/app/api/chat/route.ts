import { agents, defaultConfig } from '@/ai/agents';
import { getFactCheckerPrompt } from '@/ai/prompts';
import { generateImageTool } from '@/ai/tools';
import { Models } from '@/lib/types';
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions
} from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages, model, agentName, isSearchGrounding } = await req.json();
    const currentAgent = agents.find(agent => agent.agentName === agentName);

    if (currentAgent?.agentName === 'fact-checker') {
      const factCheckerPrompt = getFactCheckerPrompt(
        messages[messages.length - 1].content
      );
      messages.push({
        role: 'user',
        content: factCheckerPrompt
      });
    }

    const systemPrompt =
      currentAgent?.systemPrompt || defaultConfig.systemPrompt;

    const defaultTools = { generateImageTool }; // Tools for all agents
    const tools = { ...defaultTools, ...(currentAgent?.tools || {}) };

    console.log('tools', tools);
    const result = streamText({
      model: google(model, {
        useSearchGrounding: isSearchGrounding,
        ...(currentAgent?.agentName === 'fact-checker' && {
          dynamicRetrievalConfig: {
            mode: 'MODE_DYNAMIC' as const,
            dynamicThreshold: 0
          }
        })
      }),
      system: systemPrompt,
      messages,
      tools,
      temperature: defaultConfig.temperature,
      ...(model !== Models.GEMINI_2_0_FLASH_EXP && {
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 2048
            }
          } satisfies GoogleGenerativeAIProviderOptions
        }
      })
    });

    return result.toDataStreamResponse({
      sendSources: true,
      sendReasoning: true,
      sendUsage: true,
      getErrorMessage: errorHandler
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
