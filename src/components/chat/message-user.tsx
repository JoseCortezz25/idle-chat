'use client';

import { Message, MessageActions, MessageContent } from '@/components/ui/message';
import { cn } from '@/lib/utils';
import { Check, Copy, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { useRef, useState } from 'react';
import { PreviewAttachments } from '@/components/modals/preview-attachments-modal';

interface MessageUserProps {
  message: MessageAISDK;
  onEdit: (id: string, newText: string) => void;
  onReload: () => void;
  onDelete: (id: string) => void;
}

export const MessageUser = ({ message, onEdit, onReload, onDelete }: MessageUserProps) => {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [editInput, setEditInput] = useState(message.content);
  const [isEditing, setIsEditing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const imageAttachments = message.experimental_attachments?.filter(attachment => attachment.contentType?.startsWith('image/'));

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditInput(message.content);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(message.id, editInput);
    }
    onReload();
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <Message
      key={message.id}
      className={cn(
        "group",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col items-end")}>
        <div className={cn("max-w-[60%] md:max-w-[80%] grid gap-2", imageAttachments && imageAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {imageAttachments && imageAttachments.map((attachment, index) => (
            <PreviewAttachments
              key={`${message.id}-${index}`}
              image={attachment.url}
            >
              <img
                src={attachment.url}
                alt={attachment.name}
                className="w-full h-full object-cover cursor-pointer"
                />
            </PreviewAttachments>
          ))}
        </div>

        {isEditing ? (
          <div
            className="bg-accent relative flex min-w-[180px] flex-col gap-2 rounded-3xl px-5 pb-2.5 pt-3.5"
            style={{
              width: contentRef.current?.offsetWidth
            }}
          >
            <textarea
              className="w-full resize-none bg-transparent outline-none"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") {
                  handleEditCancel();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <MessageContent className="bg-gray-100/60 text-foreground px-[16px] py-[12px] rounded-[15px] !rounded-tr-[0px]">
            {message.content}
          </MessageContent>
        )}

        <MessageActions
          className={cn(
            "self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full flex gap-2",
            message.role === "user" ? "justify-end hidden md:flex" : "justify-start"
          )}>
          <Button
            variant="ghost"
            size="icon"
            className="group/item"
            onClick={() => handleCopy(message.content)}
          >
            {copyMessage === message.content ? <Check className="text-green-500" /> : <Copy className="group-hover/item:rotate-[-10deg] transition-transform duration-500"/>}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="group/item hover:bg-red-500/10 transition-all duration-500"
            onClick={handleDelete}
          >
            <Trash className="size-4 group-hover/item:text-red-500 transition-transform duration-500"/>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
