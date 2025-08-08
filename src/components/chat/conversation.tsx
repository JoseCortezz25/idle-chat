"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { ChatContainer } from "@/components/ui/chat-container";
import { MessageUser } from "./message-user";
import { MessageAssistant } from "./message-assistant";
import { Message } from "ai";
import { useRef } from "react";

interface ConversationProps {
  messages: Message[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: Error | undefined;
  reload: () => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onShowCanvas: (isShowing: boolean) => void;
};

export const Conversation = ({
  messages,
  status,
  error,
  reload,
  onEdit,
  onDelete,
  onShowCanvas
}: ConversationProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <ChatContainer
      className="flex-1 space-y-4 px-4 md:p-4 no-scrollbar"
      autoScroll={true}
      ref={chatContainerRef}
    >
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";

        if (isAssistant) {
          return (
            <MessageAssistant
              key={message.id}
              message={message}
              parts={message.parts}
              onReload={reload}
              onShowCanvas={onShowCanvas}
            />
          );
        }

        return (
          <MessageUser
            key={`${message.id}-${message.createdAt}`}
            message={message}
            onEdit={onEdit}
            onReload={reload}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        );
      })}

      {error && (
        <div className="flex items-center justify-center gap-2 bg-red-100 rounded-md p-2 text-red-950">
          <p>An error occurred. {error.message}</p>
          <button type="button" onClick={reload} className="font-bold">
            Retry
          </button>
        </div>
      )}

      {status === "submitted" && messages.length > 0 && (
        <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-2 pb-2 mx-auto">
          <TextShimmer className="font-mono text-sm" duration={3}>
            Thinking...
          </TextShimmer>
        </div>
      )}
    </ChatContainer>
  );
};