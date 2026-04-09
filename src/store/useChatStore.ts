import { create } from "zustand";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  fetchMessages: async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      set({ messages: data });
    } catch (err) {
      console.error('Failed to fetch chat:', err);
    }
  },
  addMessage: async (msg) => {
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: { 'Content-Type': 'application/json' }
    });
    get().fetchMessages();
  },
  clearChat: () => set({ messages: [] }),
}));
