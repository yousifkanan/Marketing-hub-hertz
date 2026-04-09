"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, MoreHorizontal, Calendar, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { cn } from "@/lib/utils";

type Status = "TODO" | "IN_PROGRESS" | "POSTPONED" | "COMPLETED";

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: Status;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  assignee: string;
}

export const KanbanBoard = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "TODO",
    priority: "Medium",
    deadline: "",
    assignee: user?.name || ""
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

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
      task.description?.toLowerCase().includes(query) ||
      task.assignee?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const getTasksByStatus = (status: Status) => filteredTasks.filter((t) => t.status === status);

  const openAddModal = (status: Status) => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status,
      priority: "Medium",
      deadline: new Date().toISOString().split('T')[0],
      assignee: user?.name || ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ ...task });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTask._id || editingTask.id, ...formData })
      });
      addActivity(user?.name || "System", `updated task: ${formData.title}`, "bg-blue-500");
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      addActivity(user?.name || "System", `created a new task: ${formData.title}`, "bg-purple-500");
    }
    fetchTasks();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("tasks")}</h2>
        <p className="text-slate-500">{t("tasks_desc")}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((column) => (
          <div key={column.status} className="flex w-80 flex-shrink-0 flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {column.title} ({getTasksByStatus(column.status).length})
              </h3>
              <button 
                onClick={() => openAddModal(column.status)}
                className="rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Plus className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="flex min-h-[500px] flex-col gap-3 rounded-xl bg-slate-100/30 dark:bg-slate-800/20 p-2 border border-transparent hover:border-[#ffd100]/10 transition-colors">
              {getTasksByStatus(column.status).map((task) => (
                <TaskCard key={task._id || task.id} task={task} onClick={() => openEditModal(task)} />
              ))}
              <button 
                onClick={() => openAddModal(column.status)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 py-3 text-sm font-bold text-slate-500 hover:border-[#ffd100] hover:text-[#ffd100] transition-all"
              >
                <Plus className="h-4 w-4" />
                {t("add_task")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Save className="h-5 w-5 text-[#ffd100]" />
                  {editingTask ? "Edit Task" : "New Task"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Title</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500">Deadline</label>
                    <input 
                      type="date"
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Assignee</label>
                  <input 
                    type="text"
                    value={formData.assignee}
                    onChange={e => setFormData({...formData, assignee: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#ffd100] text-slate-900 font-black neon-box hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task, onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
          task.priority === "High" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
          task.priority === "Medium" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
          "bg-yellow-50 text-[#ffd100] dark:bg-yellow-900/20 dark:text-[#ffd100]"
        )}>
          {task.priority}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
          <MoreHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm">{task.title}</h4>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {task.description}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
          <Calendar className="h-3 w-3 text-[#ffd100]" />
          {task.deadline}
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-black text-[#ffd100] border border-[var(--border)]">
          {task.assignee?.charAt(0)}
        </div>
      </div>
    </motion.div>
  );
};
