"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  LogOut, 
  Shield, 
  User as UserIcon,
  Trash2,
  Edit2,
  X,
  Save,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Role, User } from "@/types";

interface UserEntry {
  _id?: string;
  id?: string;
  name: string;
  username: string;
  position: string;
  password?: string;
  role: Role;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { logout, user: currentUser, updateUser } = useAuthStore();
  const router = useRouter();
  
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    username: "", 
    position: "", 
    password: "", 
    role: "USER" as Role 
  });

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const openAddModal = () => {
    if (!isAdmin) return;
    setEditingUser(null);
    setFormData({ name: "", username: "", position: "", password: "", role: "USER" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserEntry) => {
    // Users can only edit themselves. Admins can edit everyone.
    const isSelf = user.username === currentUser?.username;
    if (!isAdmin && !isSelf) return;

    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      username: user.username, 
      position: user.position, 
      password: "", 
      role: user.role 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isSelf = editingUser?.username === currentUser?.username;

    // Security check: Only Admins can create or edit others. Users can only edit themselves.
    if (!isAdmin && !isSelf && editingUser !== null) return;
    if (!isAdmin && editingUser === null) return;

    if (editingUser) {
      const userId = editingUser._id || editingUser.id;
      
      // Safety: If not admin, force the role to remain what it was (prevent role escalation)
      const submitData = { 
        ...formData, 
        role: isAdmin ? formData.role : editingUser.role 
      };

      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...submitData, password: formData.password || editingUser.password })
      });
      
      if (isSelf) {
        updateUser({ ...submitData } as Partial<User>);
      }
    } else {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setIsModalOpen(false);
  };

  const deleteUser = async (user: UserEntry) => {
    if (!isAdmin) return; // Only admins can delete
    const userId = user._id || user.id;
    if (users.length > 1) {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>
        <p className="text-slate-500">Manage your profile {isAdmin && "and team members"}.</p>
      </div>

      <div className="grid gap-8">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="border-b border-[var(--border)] p-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-[#ffd100]" />
              </div>
              <h3 className="font-bold text-lg">Team Members</h3>
            </div>
            {isAdmin && (
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-lg bg-[#ffd100] px-4 py-2 text-sm font-bold text-slate-900 neon-box hover:opacity-90 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </button>
            )}
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {users.map((u) => {
                const isSelf = u.username === currentUser?.username;
                const canEdit = isAdmin || isSelf;

                return (
                  <div key={u._id || u.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 hover:border-[#ffd100]/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[#ffd100] text-lg">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{u.name} {isSelf && <span className="text-[10px] text-[#ffd100] font-black underline ml-1">(YOU)</span>}</p>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                            u.role === "ADMIN" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                          )}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{u.position} • @{u.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2 text-slate-400 hover:text-[#ffd100] hover:bg-yellow-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => deleteUser(u)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          disabled={isSelf}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sign Out</h3>
                <p className="text-sm text-slate-500">Log out of the platform.</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-lg border-2 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              {t("logout")}
            </button>
          </div>
        </section>
      </div>

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
                  <UserIcon className="h-5 w-5 text-[#ffd100]" />
                  {editingUser ? "Update Profile" : "New Member"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Full Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500">Username</label>
                    <input 
                      type="text" required
                      disabled={!isAdmin && editingUser?.username === currentUser?.username}
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-500">Role</label>
                    <select 
                      disabled={!isAdmin}
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value as Role})}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Position</label>
                  <input 
                    type="text" required
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500">Password</label>
                  <input 
                    type="password" 
                    required={!editingUser}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 focus:border-[#ffd100] outline-none transition-all"
                    placeholder={editingUser ? "Leave blank to keep current" : "••••••••"}
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#ffd100] text-slate-900 font-black neon-box hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {editingUser ? "Save Changes" : "Create Member"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
