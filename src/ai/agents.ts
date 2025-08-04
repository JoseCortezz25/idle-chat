import {
  aiPromptGeneratorSystemPrompt,
  defaultSystemPrompt,
  factCheckerSystemPrompt,
  formalSystemPrompt,
  learnWithQuizzySystemPrompt,
  n8nSystemPrompt,
  socratesSystemPrompt,
  yodaSystemPrompt
} from '@/ai/prompts';
import { Agent, Model, Models } from '../lib/types';
import { z } from 'zod';
import { n8nContext } from './contexts/n8n-context';

export type AgentNames =
  | 'ai-prompt-generator'
  | 'yoda'
  | 'socrates'
  | 'quizzy'
  | 'formal'
  | 'fact-checker'
  | 'n8n-builder';

export const models: Model[] = [
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Advanced reasoning, coding, and multimodal understanding.',
    value: Models.GEMINI_2_5_PRO
  },
  {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Advanced reasoning, coding, and multimodal understanding.',
    value: Models.GEMINI_2_5_FLASH
  },
  {
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    description: 'Advanced reasoning, coding, and multimodal understanding.',
    value: Models.GEMINI_2_5_FLASH_LITE
  }
];

export const agents: Agent[] = [
  {
    name: 'AI Prompt Generator',
    description: 'A helpful assistant that can help you with your tasks.',
    image: '/images/agents/ai-prompt-generator.png',
    agentName: 'ai-prompt-generator',
    systemPrompt: aiPromptGeneratorSystemPrompt,
    tools: {
      showPromptInCanvas: {
        description: 'This tool is used to show a prompt generator.',
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              'The prompt to generate a prompt from your current context.'
            )
        }),
        execute: async ({ prompt }) => {
          return { prompt };
        }
      }
    }
  },
  {
    name: 'Yoda',
    description:
      'Yoda is a helpful assistant that can help you with your tasks.',
    image:
      'https://s1.elespanol.com/2015/12/11/actualidad/actualidad_86001588_298582_1706x1280.jpg',
    agentName: 'yoda',
    systemPrompt: yodaSystemPrompt
  },
  {
    name: 'Socrates',
    description:
      'Socrates is a helpful assistant that can help you with your tasks.',
    image:
      'https://dialektika.org/wp-content/uploads/2023/05/Socrates.jpg.webp',
    agentName: 'socrates',
    systemPrompt: socratesSystemPrompt
  },
  {
    name: 'n8n builder',
    description: 'It is helpful to build workflows using n8n.',
    image: '/images/agents/n8n-agent.png',
    agentName: 'n8n-builder',
    systemPrompt:
      n8nSystemPrompt + '\n\n <n8n_context>' + n8nContext + '</n8n_context>',
    tools: {
      showWorkflowInCanvas: {
        description: 'This tool is used to show a workflow in the canvas.',
        parameters: z.object({
          workflow: z.string()
        }),
        execute: async ({ workflow }) => {
          return { workflow };
        }
      }
    },
    suggestions: [
      {
        suggestion: 'Automate Slack notifications',
        prompt:
          'Create workflow to send a message to a Slack channel when a new email is received'
      },
      {
        suggestion: 'Track Strava workouts',
        prompt:
          'Using the Strava API, track my workouts and, if I skip too many, send me a message to my email.'
      }
    ]
  },
  {
    name: 'Learn with Quizzy',
    description: 'Agent that helps you learn and understand any topic.',
    image: '/images/agents/quizzy-agent.png',
    agentName: 'quizzy',
    systemPrompt: learnWithQuizzySystemPrompt
  },
  {
    name: 'Formal Writter',
    description: 'Create perfect, professional and too formal messages.',
    image: '/images/agents/formal-agent.png',
    agentName: 'formal',
    systemPrompt: formalSystemPrompt,
    suggestions: [
      {
        suggestion: 'Write a birthday message',
        prompt: 'Write a birthday message'
      },
      {
        suggestion: 'A letter of introduction',
        prompt: 'Write a professional letter of introduction'
      },
      {
        suggestion: 'Instagram Post',
        prompt:
          'Write a large and formal instagram post about potato cultivation'
      }
    ]
  },
  {
    name: 'AI Factly',
    description: 'Check if something is true, false or mixed.',
    image: '/images/agents/fact-checker-agent.png',
    agentName: 'fact-checker',
    systemPrompt: factCheckerSystemPrompt,
    userSearch: true,
    suggestions: [
      {
        suggestion: 'Is the moon made of cheese?',
        prompt: 'Is the moon made of cheese?'
      },
      {
        suggestion: 'Is Mark Zuckerberg an alien?',
        prompt: 'Is Mark Zuckerberg an alien?'
      },
      {
        suggestion: 'Is the Earth flat?',
        prompt: 'Is the Earth flat?'
      }
    ]
  }
];

export const defaultConfig = {
  systemPrompt: defaultSystemPrompt,
  temperature: 0.5
};
