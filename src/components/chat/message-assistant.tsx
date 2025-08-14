'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { BookMarkedIcon, Check, Copy, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { Markdown } from '../ui/markdown';
import { TextSelectionPopoverAsk } from '@/components/ui/text-selection-popover-ask';
import { useState } from 'react';
import { Source } from '../fundations/icons';
import { TextShimmer } from '../ui/text-shimmer';
import { useChat } from '@/stores/use-chat';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface MessageAssistantProps {
  message: MessageAISDK;
  parts: MessageAISDK["parts"];
  onReload: () => void;
  onShowCanvas: (isShowing: boolean) => void;
}

export const MessageAssistant = ({
  message,
  parts,
  onShowCanvas,
  onReload
}: MessageAssistantProps) => {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const { setReply } = useChat();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  const toolInvocationParts = parts?.filter(
    (part) => part.type === "tool-invocation"
  );

  const sourceParts = parts?.filter(
    (part) => part.type === "source"
  );

  const reasoningParts = parts?.find((part) => part.type === "reasoning");

  const fileParts: FileUIPart | undefined = parts?.find((part) => part.type === "file");

  return (
    <Message
      key={message.id}
      className="group justify-start"
    >
      <div className="max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col">
        {reasoningParts && reasoningParts.reasoning && (
          <div className="bg-transparent text-foreground">
            {reasoningParts.reasoning}
          </div>
        )}

        {message.content && (
          <TextSelectionPopoverAsk onAsk={(value) => setReply(value)}>
            <Markdown className="message-content">
              {message.content}
            </Markdown>
          </TextSelectionPopoverAsk>
        )}

        {fileParts && (
          <div className="flex flex-col gap-2">
            <img src={`data:${fileParts.mimeType};base64,${fileParts.data}`} alt={fileParts.mimeType} />
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {toolInvocationParts.map((toolInvocation) => {
              const toolCallId = toolInvocation.toolInvocation.toolCallId;

              switch (toolInvocation.toolInvocation.toolName) {
                case 'showPromptInCanvas': {
                  switch (toolInvocation.toolInvocation.state) {
                    case 'call':
                      return (
                        <TextShimmer>
                          Writing prompt...
                        </TextShimmer>
                      );

                    case 'result': {
                      return (
                        <button
                          key={toolCallId}
                          className="text-gray-500 bg-muted/50 rounded-md p-2 flex items-center gap-3 cursor-pointer"
                          onClick={() => onShowCanvas(true)}
                        >
                          <div className="w-[45px] h-[45px] rounded-md border-[1.5px] border-gray-200 flex items-center justify-center">
                            <BookMarkedIcon className="size-5" />
                          </div>
                          <span className="text-sm">Showing prompt in canvas...</span>
                        </button>
                      );
                    }
                  }
                  break;
                }
              }
            })}
          </div>
        )}

        {sourceParts && sourceParts.length > 0 && (
          <div className="flex flex-wrap gap-1 w-full mt-2">
            {sourceParts.map((source) => (
              <div key={source.source.id} className="text-brand-green font-semibold bg-brand-green/10 rounded-full py-2 px-4 text-sm flex items-center gap-2">
                <a href={source.source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Source className="size-4" />
                  <p className="text-sm">{source.source.title}</p>
                </a>
              </div>
            ))}
          </div>
        )}

        <MessageActions className="self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => handleCopy(message.content)}
          >
            {copyMessage === message.content ? <Check className="text-green-500" /> : <Copy className="group-hover/item:rotate-[-10deg] transition-transform duration-500" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => onReload()}
          >
            <RefreshCcw className="group-hover/item:rotate-180 transition-transform duration-700" />
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
