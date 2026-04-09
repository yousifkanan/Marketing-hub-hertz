"use client";

import React, { useState, useMemo } from "react";
import { Plus, MoreHorizontal, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { cn } from "@/lib/utils";

type Status = "TODO" | "IN_PROGRESS" | "POSTPONED" | "COMPLETED";

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  assignee: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Campaign Strategy Q3",
    description: "Define main goals and KPIs for the next quarter.",
    status: "IN_PROGRESS",
    priority: "High",
    deadline: "2024-04-15",
    assignee: "YK",
  },
  {
    id: "2",
    title: "Social Media Assets",
    description: "Design 10 new templates for Instagram posts.",
    status: "TODO",
    priority: "Medium",
    deadline: "2024-04-20",
    assignee: "Sara",
  },
  {
    id: "3",
    title: "Weekly Newsletter",
    description: "Draft and schedule the weekly marketing newsletter.",
    status: "COMPLETED",
    priority: "Low",
    deadline: "2024-04-08",
    assignee: "Ahmed",
  },
];

export const KanbanBoard = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();
  
  const [tasks] = useState<Task[]>(initialTasks);

  const columns: { title: string; status: Status }[] = [
    { title: "To Do", status: "TODO" },
    { title: t("in_progress"), status: "IN_PROGRESS" },
    { title: t("postponed"), status: "POSTPONED" },
    { title: t("completed"), status: "COMPLETED" },
  ];

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query) ||
      task.assignee.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const getTasksByStatus = (status: Status) => filteredTasks.filter((t) => t.status === status);

  const handleAddTask = () => {
    addActivity(user?.name || "System", "assigned a new marketing task", "bg-purple-500");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("tasks")}</h2>
        <p className="text-slate-500">{t("tasks_desc")}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.status} className="flex w-80 flex-shrink-0 flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {column.title} ({getTasksByStatus(column.status).length})
              </h3>
              <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <Plus className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="flex min-h-[500px] flex-col gap-3 rounded-xl bg-slate-100/30 dark:bg-slate-800/20 p-2">
              {getTasksByStatus(column.status).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              <button 
                onClick={handleAddTask}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 py-3 text-sm font-bold text-slate-500 hover:border-[#ffd100] hover:text-[#ffd100] transition-all"
              >
                <Plus className="h-4 w-4" />
                {t("add_task")}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
          <p className="text-slate-500 font-medium">No tasks found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
          task.priority === "High" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
          task.priority === "Medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
          "bg-yellow-50 text-[#ffd100] dark:bg-yellow-900/20 dark:text-[#ffd100]"
        )}>
          {task.priority}
        </span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
          <MoreHorizontal className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div>
        <h4 className="font-semibold">{task.title}</h4>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {task.description}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          {task.deadline}
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
          {task.assignee.charAt(0)}
        </div>
      </div>
    </motion.div>
  );
};
