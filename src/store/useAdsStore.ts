import { create } from "zustand";

export interface AdEntry {
  id: string;
  adId: string;
  budget: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  views: number;
  messages: number;
}

interface AdsState {
  ads: AdEntry[];
  fetchAds: () => Promise<void>;
  addAd: (ad: AdEntry) => Promise<void>;
  removeAd: (id: string) => Promise<void>;
  updateAd: (id: string, field: keyof AdEntry, value: string | number) => Promise<void>;
}

export const useAdsStore = create<AdsState>((set, get) => ({
  ads: [],
  fetchAds: async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      set({ ads: data });
    } catch (err) {
      console.error('Failed to fetch ads:', err);
    }
  },
  addAd: async (ad) => {
    await fetch('/api/ads', {
      method: 'POST',
      body: JSON.stringify(ad),
      headers: { 'Content-Type': 'application/json' }
    });
    get().fetchAds();
  },
  removeAd: async (id) => {
    await fetch('/api/ads', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    get().fetchAds();
  },
  updateAd: async (id, field, value) => {
    // Optimistic update
    set({
      ads: get().ads.map(ad => ad.id === id ? { ...ad, [field]: value } : ad)
    });
    await fetch('/api/ads', {
      method: 'PUT',
      body: JSON.stringify({ id, field, value }),
      headers: { 'Content-Type': 'application/json' }
    });
  },
}));
