import { create } from 'zustand';

export interface DataRow {
  id: string; // Internal ID
  [key: string]: any;
}

interface DataState {
  columns: string[];
  rows: DataRow[];
  photoDirectory: string | null;
  setColumns: (columns: string[]) => void;
  setRows: (rows: DataRow[]) => void;
  addRow: (row: DataRow) => void;
  updateRow: (id: string, updates: Partial<DataRow>) => void;
  deleteRow: (id: string) => void;
  setPhotoDirectory: (dir: string | null) => void;
  activeRowIndex: number;
  setActiveRowIndex: (index: number) => void;
}

export const useDataStore = create<DataState>((set) => ({
  columns: [],
  rows: [],
  photoDirectory: null,
  activeRowIndex: 0,
  setColumns: (columns) => set({ columns }),
  setRows: (rows) => set({ rows, activeRowIndex: 0 }),
  addRow: (row) => set((state) => ({ rows: [...state.rows, row] })),
  updateRow: (id, updates) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  deleteRow: (id) =>
    set((state) => ({
      rows: state.rows.filter((r) => r.id !== id),
      activeRowIndex: Math.min(state.activeRowIndex, state.rows.length - 2),
    })),
  setPhotoDirectory: (dir) => set({ photoDirectory: dir }),
  setActiveRowIndex: (index) => set({ activeRowIndex: index }),
}));
