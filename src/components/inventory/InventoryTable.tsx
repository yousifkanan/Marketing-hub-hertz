"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { cn } from "@/lib/utils";

interface InventoryItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export const InventoryTable = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearchStore();
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();

  const [items, setItems] = useState<InventoryItem[]>([]);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const handleAddItem = async () => {
    const newItem = {
      name: "New Equipment",
      category: "Misc",
      quantity: 1,
      status: "In Stock",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    await fetch('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchItems();
    addActivity(user?.name || "System", "added a new item to Inventory", "bg-green-500");
  };

  const handleDeleteItem = async (id: string, name: string) => {
    await fetch('/api/inventory', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchItems();
    addActivity(user?.name || "System", `removed ${name} from Inventory`, "bg-red-500");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("inventory")}</h2>
          <p className="text-slate-500">{t("inventory_desc")}</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="flex items-center gap-2 rounded-lg bg-[#ffd100] px-4 py-2 text-sm font-bold text-slate-900 neon-box hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("add_item")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm rtl:text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">{t("items")}</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">{t("quantity")}</th>
                <th className="px-6 py-4 font-medium">{t("status")}</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredItems.map((item) => {
                const itemId = item._id || item.id || '';
                return (
                  <tr key={itemId} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500">{item.category}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        item.status === "In Stock" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        item.status === "Low Stock" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Edit2 className="h-4 w-4 text-slate-500" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(itemId, item.name)}
                          className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
          <p className="text-slate-500 font-medium">No inventory items found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
