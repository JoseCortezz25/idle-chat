import { AgentNames } from '@/ai/agents';
import { ToolSet } from 'ai';

export enum Models {
  GPT_4 = 'gpt-4.1',
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_5_MINI = 'gpt-5-mini-2025-08-07',
  GPT_5 = 'gpt-5-2025-08-07',
  GPT_NANO = 'gpt-5-nano-2025-08-07',
  GEMINI_2_5_FLASH_PREVIEW_04_17 = 'gemini-2.5-flash-preview-04-17',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_PRO_PREVIEW_03_25 = 'gemini-2.5-pro-exp-03-25',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_0_FLASH_EXP = 'gemini-2.0-flash-exp',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite'
}

export type Agent = {
  name: string;
  description: string;
  image: string;
  agentName: AgentNames;
  systemPrompt: string;
  tools?: ToolSet;
  suggestions?: {
    suggestion: string;
    prompt: string;
  }[];
  userSearch?: boolean;
};

export type Model = {
  name: string;
  provider: string;
  description: string;
  value: string;
};

export type ModelConfig = {
  provider: 'OpenAI' | 'Google';
  model: Models;
  apiKey: string;
};
