"use client";

import React, { useState, useMemo } from "react";
import { Plus, Video, Image as ImageIcon, FileText, MoreVertical, Tag } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  type: "Post" | "Reel" | "Story" | "Script";
  status: "Draft" | "Published" | "Scheduled";
  tags: string[];
  thumbnail?: string;
}

export const ContentGrid = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();

  const [content] = useState<ContentItem[]>([
    { id: "1", title: "Product Launch Reel", type: "Reel", status: "Published", tags: ["launch", "video"], thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=200&h=200&auto=format&fit=crop" },
    { id: "2", title: "Summer Campaign Post", type: "Post", status: "Scheduled", tags: ["summer", "promo"] },
    { id: "3", title: "Interview Script - CEO", type: "Script", status: "Draft", tags: ["internal", "script"] },
    { id: "4", title: "Behind the Scenes Story", type: "Story", status: "Published", tags: ["office", "fun"] },
  ]);

  const filteredContent = useMemo(() => {
    if (!searchQuery) return content;
    const query = searchQuery.toLowerCase();
    return content.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.type.toLowerCase().includes(query)
    );
  }, [content, searchQuery]);

  const handleCreateContent = () => {
    addActivity(user?.name || "System", "created a new content draft", "bg-blue-500");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("content")}</h2>
          <p className="text-slate-500">{t("content_desc")}</p>
        </div>
        <button 
          onClick={handleCreateContent}
          className="flex items-center gap-2 rounded-lg bg-[#ffd100] px-4 py-2 text-sm font-bold text-slate-900 neon-box hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("add_item")}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
      
      {filteredContent.length === 0 && (
        <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
          <p className="text-slate-500 font-medium">No content found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

const ContentCard = ({ item }: { item: ContentItem }) => {
  const { t } = useTranslation();
  
  const Icon = {
    Post: ImageIcon,
    Reel: Video,
    Story: Video,
    Script: FileText,
  }[item.type];

  return (
    <div className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg">
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800/50">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={cn(
            "rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm",
            item.status === "Published" ? "bg-green-500" :
            item.status === "Scheduled" ? "bg-blue-500" :
            "bg-slate-500"
          )}>
            {item.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase">
              <Icon className="h-3 w-3" />
              {item.type}
            </div>
            <h4 className="mt-1 font-semibold line-clamp-1">
              {item.title}
            </h4>
          </div>
          <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
              <Tag className="h-2 w-2" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
