"use client";

import React, { useMemo, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdsStore } from "@/store/useAdsStore";
import { useActivityStore } from "@/store/useActivityStore";
import { ArrowUpRight, ArrowDownRight, Activity, Users, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const data = [
  { name: "Jan", reach: 4000, engagement: 2400 },
  { name: "Feb", reach: 3000, engagement: 1398 },
  { name: "Mar", reach: 2000, engagement: 9800 },
  { name: "Apr", reach: 2780, engagement: 3908 },
  { name: "May", reach: 1890, engagement: 4800 },
  { name: "Jun", reach: 2390, engagement: 3800 },
];

export const DashboardOverview = () => {
  const { t } = useTranslation();
  const { theme } = useAppStore();
  const { user } = useAuthStore();
  const { ads, fetchAds } = useAdsStore();
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchAds();
    fetchActivities();
    
    // Poll for updates every 5 seconds for local network feel
    const interval = setInterval(() => {
      fetchAds();
      fetchActivities();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const adsStats = useMemo(() => {
    return ads.reduce(
      (acc, ad) => ({
        totalSpend: acc.totalSpend + (Number(ad.budget) || 0),
        totalReach: acc.totalReach + (Number(ad.reach) || 0),
        totalImpressions: acc.totalImpressions + (Number(ad.impressions) || 0),
        totalEngagement: acc.totalEngagement + (Number(ad.likes) || 0) + (Number(ad.comments) || 0),
      }),
      { totalSpend: 0, totalReach: 0, totalImpressions: 0, totalEngagement: 0 }
    );
  }, [ads]);

  const chartColor = "#ffd100";
  const gridColor = theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("welcome")}, {user?.name || "Yousif"}</h2>
        <p className="text-slate-500">
          {t("dashboard_desc")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title={t("total_spend")} value={`$${adsStats.totalSpend.toLocaleString()}`} change="+12.5%" isPositive icon={Users} />
        <MetricCard title={t("total_reach")} value={adsStats.totalReach.toLocaleString()} change="+0.4%" isPositive icon={Activity} />
        <MetricCard title={t("impressions")} value={adsStats.totalImpressions.toLocaleString()} change="-0.2%" isPositive={false} icon={Target} />
        <MetricCard title="Total Engagement" value={adsStats.totalEngagement.toLocaleString()} change="+3" isPositive icon={Zap} />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-4 shadow-sm">
          <h3 className="mb-6 font-bold">{t("reach_vs_engagement")}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? "#0f172a" : "#fff", 
                    border: "1px solid var(--border)", 
                    borderRadius: "8px", 
                    color: "var(--foreground)" 
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke={chartColor} 
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-3 shadow-sm">
          <h3 className="mb-6 font-bold">{t("recent_activity")}</h3>
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.length > 0 ? (
              activities.map((act) => (
                <ActivityItem 
                  key={act.id}
                  user={act.user} 
                  action={act.action} 
                  time={act.time === "Just now" ? act.time : formatDistanceToNow(act.timestamp) + " ago"} 
                  color={act.color} 
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4 text-xs italic">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="rounded-lg bg-slate-100 dark:bg-slate-800/50 p-2">
        <Icon className="h-5 w-5 text-[#ffd100] neon-glow" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-green-500" : "text-red-500"
      )}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const ActivityItem = ({ user, action, time, color }: any) => (
  <div className="flex items-start gap-4">
    <div className={cn("h-2 w-2 rounded-full mt-2", color)} />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-[var(--foreground)] leading-snug">
        <span className="font-bold">{user}</span> {action}
      </p>
      <p className="text-[10px] text-slate-500 font-medium">{time}</p>
    </div>
  </div>
);
