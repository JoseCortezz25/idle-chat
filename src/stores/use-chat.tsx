import { create } from 'zustand';

interface ChatStore {
  replyMessage: string | null;
  setReply: (message: string) => void;
}

export const useChat = create<ChatStore>(set => ({
  replyMessage: null,
  setReply: message => set({ replyMessage: message })
}));
