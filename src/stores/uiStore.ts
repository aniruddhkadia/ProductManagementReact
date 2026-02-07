import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  tableDensity: "compact" | "normal" | "spacious";
  pageSize: number;
  sidebarExpanded: boolean;
  setTableDensity: (density: "compact" | "normal" | "spacious") => void;
  setPageSize: (size: number) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      tableDensity: "normal",
      pageSize: 10,
      sidebarExpanded: false, // Default to collapsed
      setTableDensity: (density) => set({ tableDensity: density }),
      setPageSize: (size) => set({ pageSize: size }),
      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
    }),
    {
      name: "ui-storage",
    },
  ),
);
