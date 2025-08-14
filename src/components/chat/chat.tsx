"use client";

import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useState, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { useSearchParams } from 'next/navigation';
import { Agent, Models } from '@/lib/types';
import { useAgent } from '@/stores/use-agent';
import { agents } from '@/ai/agents';
import { Conversation } from './conversation';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from './canvas';
import { useFileStore } from '@/stores/use-file';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    updateMatches();
    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

export const Chat = () => {
  const searchParams = useSearchParams();
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [artifactValue, setArtifactValue] = useState<string | null>(null);
  const { setAgent } = useAgent();
  const [agentPrompt, setAgentPrompt] = useState<Agent | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSearchGrounding, setIsSearchGrounding] = useState(false);
  const { files: filesFromHome } = useFileStore();
  const [files, setFiles] = useState<FileList | undefined>(filesFromHome || undefined);
  const [suggestions, setSuggestions] = useState<Agent['suggestions']>([]);

  const handleSelectAgent = (agentName: string) => {
    if (!agentName) return;

    const selectedAgent = agents.filter(agent => agent.agentName === agentName);
    const agent = selectedAgent[0];

    if (agent.userSearch) setIsSearchGrounding(true);

    setSuggestions(agent.suggestions);
    setAgent(agent || null);
    setAgentPrompt(agent || null);
  };

  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status,
    append,
    stop,
    error,
    reload
  } = useChat({
    maxSteps: 1,
    body: {
      model: globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH,
      agentName: agentPrompt?.agentName || null,
      isSearchGrounding,
      apiKey: globalThis?.localStorage?.getItem("apiKey") || ""
    },
    onError: (error) => {
      console.error('Error in chat:', error);
    },
    onToolCall({ toolCall }) {
      console.log('toolCall', toolCall);

      if (toolCall.toolName === 'showPromptInCanvas') {
        setIsArtifactPanelOpen(true);
        setArtifactValue((toolCall.args as { prompt: string }).prompt);
      }

      if (toolCall.toolName === 'showEstimationInCanvas') {
        setIsArtifactPanelOpen(true);
        setArtifactValue((toolCall.args as { estimation: string }).estimation);
      }
    }
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt) return;
    const isMessageExists = messages.some(message => message.content === prompt);

    if (!isMessageExists) {
      append({
        role: "user",
        content: prompt
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!window) return;
    const agentName = searchParams.get("agent");
    document.title = agentName ? `Idle - Talking with ${agentName}` : 'Idle - Chat';

  }, [document.title, searchParams]);

  useEffect(() => {
    const agentName = searchParams.get("agent");
    const useSearch = searchParams.get("search");

    if (agentName) {
      handleSelectAgent(agentName);
    }

    if (useSearch) {
      setIsSearchGrounding(true);
    }
  }, [searchParams]);

  const toggleArtifactPanel = () => {
    setIsArtifactPanelOpen(prev => !prev);
  };

  const handleEdit = useCallback((id: string, newText: string) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, content: newText } : message
      )
    );
  },
    [messages, setMessages]);

  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id));
    },
    [messages, setMessages]
  );

  const chatVariants = {
    open: {
      width: isMobile ? "0%" : "40%",
      padding: isMobile ? "0px" : "0 16px",
      opacity: isMobile ? 0 : 1,
      transition: { duration: isMobile ? 0.3 : 0.5, delay: isMobile && isArtifactPanelOpen ? 0 : 0.2 }
    },
    closed: {
      width: "100%",
      padding: "0 16px",
      opacity: 1,
      transition: { duration: 0.5, delay: isMobile && !isArtifactPanelOpen ? 0.2 : 0 }
    }
  };

  const panelTransition = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    duration: 0.5
  };

  return (
    <div className="flex w-full h-[calc(100dvh-72px)] overflow-hidden">
      <motion.section
        className="flex flex-col items-stretch h-full relative"
        variants={chatVariants}
        initial="closed"
        animate={isArtifactPanelOpen ? "open" : "closed"}
        transition={panelTransition}
      >
        <div className="w-full max-w-chat mx-auto flex flex-col flex-1 h-full pb-[16px] overflow-hidden !px-0 sm:px-4">
          <Conversation
            messages={messages}
            status={status}
            error={error}
            reload={reload}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowCanvas={setIsArtifactPanelOpen}
          />

          {messages.length < 1 && suggestions && (
            <motion.div className="flex gap-[16px] mb-4 flex-col md:flex-row">
              {suggestions.map(suggestion => (
                <motion.div key={suggestion.prompt}>
                  <Button
                    variant="suggestion"
                    className="rounded-full cursor-pointer"
                    onClick={() => setInput(suggestion.prompt)}
                  >
                    {suggestion.suggestion}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}

          <PromptTextarea
            inputValue={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={status === 'submitted' || status === 'streaming'}
            stop={stop}
            setIsSearchGrounding={setIsSearchGrounding}
            isSearchGrounding={isSearchGrounding}
            files={files}
            setFiles={setFiles}
          />
        </div>
      </motion.section>

      {/* TODO: Add artifact panel */}
      <AnimatePresence>
        {isArtifactPanelOpen && (
          <Canvas
            artifactValue={artifactValue || ''}
            toggleArtifactPanel={toggleArtifactPanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
