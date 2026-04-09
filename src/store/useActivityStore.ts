import { create } from "zustand";

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  timestamp: number;
  color: string;
}

interface ActivityState {
  activities: Activity[];
  fetchActivities: () => Promise<void>;
  addActivity: (user: string, action: string, color?: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  fetchActivities: async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      set({ activities: data });
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  },
  addActivity: async (user, action, color = "bg-[#ffd100]") => {
    await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify({ user, action, color }),
      headers: { 'Content-Type': 'application/json' }
    });
    get().fetchActivities();
  },
}));
