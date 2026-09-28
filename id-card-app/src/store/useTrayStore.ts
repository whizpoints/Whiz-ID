import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HardwareProfile {
  id: string;
  name: string;
  globalMarginX: number;
  globalMarginY: number;
  slot1OffsetX: number;
  slot1OffsetY: number;
  slot2OffsetX: number;
  slot2OffsetY: number;
  interCardGap: number;
}

interface TrayState {
  activeProfileId: string;
  profiles: HardwareProfile[];
  addProfile: (profile: HardwareProfile) => void;
  updateProfile: (id: string, updates: Partial<HardwareProfile>) => void;
  setActiveProfile: (id: string) => void;
}

const defaultProfile: HardwareProfile = {
  id: 'default',
  name: 'Default Epson Tray',
  globalMarginX: 0,
  globalMarginY: 0,
  slot1OffsetX: 0,
  slot1OffsetY: 0,
  slot2OffsetX: 0,
  slot2OffsetY: 0,
  interCardGap: 10,
};

export const useTrayStore = create<TrayState>()(
  persist(
    (set) => ({
      activeProfileId: 'default',
      profiles: [defaultProfile],
      addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      setActiveProfile: (id) => set({ activeProfileId: id }),
    }),
    {
      name: 'tray-storage',
    }
  )
);
