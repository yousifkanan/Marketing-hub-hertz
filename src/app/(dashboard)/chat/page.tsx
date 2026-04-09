"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, Bot } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const { t, language } = useTranslation();
  const { user } = useAuthStore();
  const { messages, addMessage, fetchMessages } = useChatStore();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // More frequent for chat
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    await addMessage({
      senderId: user.id,
      senderName: user.name,
      text: inputText,
    });
    setInputText("");
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const emojis = ["😊", "👍", "🔥", "🚀", "📢", "📊", "✅", "💡", "🎨", "💻"];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-xl">
            <Bot className="h-5 w-5 text-[#ffd100] neon-glow" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{t("chat")}</h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-green-500">Live Team Portal</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const isSystem = msg.senderId === "system";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  isMe ? "ms-auto items-end" : "me-auto items-start",
                  isSystem && "mx-auto items-center max-w-full"
                )}
              >
                {!isSystem && (
                  <span className="text-[10px] font-black uppercase text-slate-500 mb-1 px-1">
                    {msg.senderName} • {format(msg.timestamp, "p")}
                  </span>
                )}
                
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                  isMe 
                    ? "bg-slate-200 dark:bg-slate-800 text-[var(--foreground)] rounded-tr-none" 
                    : "bg-[#ffd100] text-slate-900 font-medium rounded-tl-none neon-box",
                  isSystem && "bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs italic border-none rounded-full px-6"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Emojis */}
      <div className="px-4 py-2 border-t border-[var(--border)] flex gap-2 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-800/5">
        {emojis.map(emoji => (
          <button 
            key={emoji}
            onClick={() => addEmoji(emoji)}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors grayscale hover:grayscale-0"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[var(--card)] flex items-center gap-3">
        <button type="button" className="p-2 text-slate-400 hover:text-[#ffd100] transition-colors">
          <Paperclip className="h-5 w-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("type_message")}
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 px-4 pr-12 focus:border-[#ffd100] outline-none transition-all text-sm"
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500">
            <Smile className="h-5 w-5" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3 bg-[#ffd100] text-slate-900 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 active:scale-95"
        >
          <Send className={cn("h-5 w-5", language !== 'en' && "rtl-flip")} />
        </button>
      </form>
    </div>
  );
}
