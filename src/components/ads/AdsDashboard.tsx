"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, TrendingUp, DollarSign, Users, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useAdsStore, AdEntry } from "@/store/useAdsStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { cn } from "@/lib/utils";

export const AdsDashboard = () => {
  const { t } = useTranslation();
  const { ads, addAd, removeAd, updateAd, fetchAds } = useAdsStore();
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();

  useEffect(() => {
    fetchAds();
    const interval = setInterval(fetchAds, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredAds = useMemo(() => {
    if (!searchQuery) return ads;
    const query = searchQuery.toLowerCase();
    return ads.filter((ad) => 
      ad.adId.toLowerCase().includes(query) ||
      ad.budget.toString().includes(query) ||
      ad.reach.toString().includes(query)
    );
  }, [ads, searchQuery]);

  const stats = useMemo(() => {
    return filteredAds.reduce(
      (acc, ad) => ({
        totalSpend: acc.totalSpend + (Number(ad.budget) || 0),
        totalReach: acc.totalReach + (Number(ad.reach) || 0),
        totalImpressions: acc.totalImpressions + (Number(ad.impressions) || 0),
        totalEngagement: acc.totalEngagement + (Number(ad.likes) || 0) + (Number(ad.comments) || 0),
      }),
      { totalSpend: 0, totalReach: 0, totalImpressions: 0, totalEngagement: 0 }
    );
  }, [filteredAds]);

  const handleAddAd = () => {
    const newAd: any = {
      adId: `AD-${(ads.length + 1).toString().padStart(3, "0")}`,
      budget: 0,
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      views: 0,
      messages: 0,
    };
    addAd(newAd);
    addActivity(user?.name || "System", `created a new Ad entry: ${newAd.adId}`, "bg-[#ffd100]");
  };

  const handleRemoveAd = (id: string, adId: string) => {
    removeAd(id);
    addActivity(user?.name || "System", `deleted Ad entry: ${adId}`, "bg-red-500");
  };

  const handleUpdateAd = (id: string, adId: string, field: keyof AdEntry, value: string | number) => {
    updateAd(id, field, value);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("ads")}</h2>
          <p className="text-slate-500">
            {t("ads_desc")}
          </p>
        </div>
        <button
          onClick={handleAddAd}
          className="flex items-center gap-2 rounded-lg bg-[#ffd100] px-4 py-2 text-sm font-bold text-slate-900 neon-box hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("add_entry")}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t("total_spend")} value={`$${stats.totalSpend.toLocaleString()}`} icon={DollarSign} />
        <StatCard title={t("total_reach")} value={stats.totalReach.toLocaleString()} icon={Users} />
        <StatCard title={t("impressions")} value={stats.totalImpressions.toLocaleString()} icon={Eye} />
        <StatCard title="Engagement" value={stats.totalEngagement.toLocaleString()} icon={TrendingUp} />
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm rtl:text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ad ID</th>
                <th className="px-4 py-3 font-medium">{t("budget")} ($)</th>
                <th className="px-4 py-3 font-medium">{t("reach")}</th>
                <th className="px-4 py-3 font-medium">{t("impressions")}</th>
                <th className="px-4 py-3 font-medium">{t("likes")}</th>
                <th className="px-4 py-3 font-medium">{t("comments")}</th>
                <th className="px-4 py-3 font-medium">{t("views")}</th>
                <th className="px-4 py-3 font-medium">{t("messages")}</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <AnimatePresence initial={false}>
                {filteredAds.map((ad) => {
                  const adId = ad._id || ad.id || '';
                  return (
                    <motion.tr
                      key={adId}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={ad.adId}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "adId", e.target.value)}
                          className="w-24 bg-transparent focus:outline-none font-medium"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.budget}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "budget", Number(e.target.value))}
                          className="w-20 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.reach}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "reach", Number(e.target.value))}
                          className="w-24 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.impressions}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "impressions", Number(e.target.value))}
                          className="w-24 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.likes}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "likes", Number(e.target.value))}
                          className="w-16 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.comments}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "comments", Number(e.target.value))}
                          className="w-16 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.views}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "views", Number(e.target.value))}
                          className="w-20 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={ad.messages}
                          onChange={(e) => handleUpdateAd(adId, ad.adId, "messages", Number(e.target.value))}
                          className="w-16 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveAd(adId, ad.adId)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }: any) => {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-lg p-3 bg-yellow-500/10 text-[#ffd100]">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};
