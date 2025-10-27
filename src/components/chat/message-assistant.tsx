'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { BookMarkedIcon, Check, Copy, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReasoningUIPart, SourceDocumentUIPart, SourceUrlUIPart, UIMessage } from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';
import { Source } from '../fundations/icons';
import { TextShimmer } from '../ui/text-shimmer';
import { getMessageText } from '@/lib/message-utils';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface MessageAssistantProps {
  message: UIMessage;
  parts: UIMessage["parts"];
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

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  // Tool invocations now use tool-{toolName} type pattern
  const toolInvocationParts = parts?.filter(
    (part) => part.type.startsWith("tool-")
  );

  const sourceParts = parts?.filter(
    (part) => part.type === "source-url" || part.type === "source-document"
  ) as SourceUrlUIPart[] | SourceDocumentUIPart[] | undefined;

  const reasoningParts = parts?.find((part) => part.type === "reasoning") as ReasoningUIPart | undefined;

  const fileParts: FileUIPart | undefined = parts?.find((part) => part.type === "file") as FileUIPart | undefined;

  const textContent = getMessageText(message);

  return (
    <Message
      key={message.id}
      className="group justify-start"
    >
      <div className="max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col">
        {reasoningParts && reasoningParts.text && (
          <div className="bg-transparent text-foreground">
            {reasoningParts.text}
          </div>
        )}

        {textContent && (
          <Markdown className="message-content">
            {textContent}
          </Markdown>
        )}

        {fileParts && (
          <div className="flex flex-col gap-2">
            <img src={`data:${fileParts.mimeType};base64,${fileParts.data}`} alt={fileParts.mimeType} />
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {toolInvocationParts.map((toolInvocation) => {

              switch (toolInvocation.type) {
                case 'tool-showPromptInCanvas': {
                  const callId = toolInvocation.toolCallId;

                  // States: input-streaming, input-available, output-available, output-error
                  switch (toolInvocation.state) {
                    case 'input-streaming':
                      return (
                        <TextShimmer>
                          Writing prompt...
                        </TextShimmer>
                      );
                    case 'output-available':
                      return (
                        <button
                          key={callId}
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
                  break;
                }
              }
            })}
          </div>
        )}

        {sourceParts && sourceParts.length > 0 && (
          <div className="flex flex-wrap gap-1 w-full mt-2">
            {sourceParts.map((source) => (
              <div key={source.sourceId} className="text-brand-green font-semibold bg-brand-green/10 rounded-full py-2 px-4 text-sm flex items-center gap-2">
                <a href={"url" in source ? source.url : ""} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Source className="size-4" />
                  <p className="text-sm">{source.title}</p>
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
            onClick={() => handleCopy(textContent)}
          >
            {copyMessage === textContent ? <Check className="text-green-500" /> : <Copy className="group-hover/item:rotate-[-10deg] transition-transform duration-500" />}
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
