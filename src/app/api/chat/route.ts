import { agents, defaultConfig } from '@/ai/agents';
import { getFactCheckerPrompt } from '@/ai/prompts';
import { generateImageTool } from '@/ai/tools';
import { Models } from '@/lib/types';
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions
} from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { getMessageText } from '@/lib/message-utils';

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

    // Work with UIMessages
    let uiMessages: UIMessage[] = messages;

    if (currentAgent?.agentName === 'fact-checker') {
      const lastMessage = uiMessages[uiMessages.length - 1];
      const lastMessageText = getMessageText(lastMessage);
      const factCheckerPrompt = getFactCheckerPrompt(lastMessageText);
      
      uiMessages = [...uiMessages, {
        role: 'user',
        parts: [{ type: 'text', text: factCheckerPrompt }]
      }];
    }

    const systemPrompt =
      currentAgent?.systemPrompt || defaultConfig.systemPrompt;

    const defaultTools = { generateImageTool }; // Tools for all agents
    const tools = { ...defaultTools, ...(currentAgent?.tools || {}) };

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
      messages: convertToModelMessages(uiMessages),
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

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendSources: true,
      sendReasoning: true,
      sendUsage: true,
      onError: errorHandler
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
