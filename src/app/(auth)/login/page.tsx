"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { LogIn, Shield, User, Lock } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/users');
      const users = await res.json();
      
      const matchedUser = users.find((u: any) => 
        u.username === username && u.password === password
      );

      if (matchedUser) {
        setUser({
          id: matchedUser.id,
          name: matchedUser.name,
          email: `${matchedUser.username}@company.com`,
          username: matchedUser.username,
          position: matchedUser.position,
          role: matchedUser.role,
        }, "mock-jwt-token");
        router.push("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd100] neon-box">
            <Shield className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Marketing Hub <span className="text-[#ffd100]">YK</span></h1>
          <p className="mt-2 text-slate-400">Team Login Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white focus:border-[#ffd100] focus:outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white focus:border-[#ffd100] focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd100] py-3 text-sm font-black text-slate-900 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 neon-box"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Access Hub
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          <p>Internal Use Only • Secure Session</p>
        </div>
      </motion.div>
    </div>
  );
}
