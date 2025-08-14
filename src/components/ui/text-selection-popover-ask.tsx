'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Quote } from 'lucide-react';

type TextSelectionPopoverAskProps = {
  children: React.ReactNode;
  buttonText?: string;
  onAsk?: (selectedText: string) => void;
  className?: string;
};

export const TextSelectionPopoverAsk = ({
  children,
  buttonText = 'Preguntar a Idle',
  onAsk,
  className
}: TextSelectionPopoverAskProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const hide = () => {
    setOpen(false);
    setPosition(null);
  };

  const computeAndOpenFromSelection = () => {
    const selection = globalThis?.getSelection?.();
    const containerEl = containerRef.current;
    if (!selection || selection.isCollapsed || !containerEl) return hide();

    const text = selection.toString().trim();
    if (!text) return hide();

    const range = selection.getRangeAt(0);
    if (!containerEl.contains(range.startContainer) || !containerEl.contains(range.endContainer)) {
      return hide();
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const offset = 8;
    const top = rect.bottom - containerRect.top + offset;
    const left = rect.left - containerRect.left;

    const clampedLeft = Math.max(8, Math.min(left, containerEl.clientWidth - 180));
    const clampedTop = Math.max(0, top);

    setSelectedText(text);
    setPosition({ top: clampedTop, left: clampedLeft });
    setOpen(true);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseUp = () => computeAndOpenFromSelection();
    const handleMouseDown = () => hide();
    const handleKeyUp = () => computeAndOpenFromSelection();
    const handleSelectionChange = () => {
      const sel = globalThis?.getSelection?.();
      if (!sel || sel.isCollapsed) hide();
    };

    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('keyup', handleKeyUp as unknown as EventListener);

    document.addEventListener('scroll', hide, true);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('keyup', handleKeyUp as unknown as EventListener);

      document.removeEventListener('scroll', hide, true);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      {position && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <span
              aria-hidden
              style={{ position: 'absolute', top: position.top, left: position.left, width: 1, height: 1 }}
            />
          </PopoverAnchor>
          <PopoverContent className="w-fit p-0 rounded-xl bg-primary text-primary-foreground hover:opacity-90">
            <button
              type="button"
              className="text-xs px-3 py-2 cursor-pointer flex gap-2 items-center justify-center"
              onClick={() => {
                onAsk?.(selectedText);
                hide();
              }}
            >
              <Quote className="size-3" />
              {buttonText}
            </button>
          </PopoverContent>
        </Popover>
      )}
      {children}
    </div>
  );
};


