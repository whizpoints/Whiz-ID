import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NodeType = 'text' | 'image' | 'shape' | 'barcode' | 'qr';

export interface NodeBase {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked?: boolean;
}

export interface TextNode extends NodeBase {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right' | 'justify';
  isDynamic?: boolean;
  boundColumn?: string;
}

export interface ImageNode extends NodeBase {
  type: 'image';
  src?: string;
  fit: 'fill' | 'contain' | 'cover';
  isDynamic?: boolean;
  boundColumn?: string;
}

export interface ShapeNode extends NodeBase {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'ellipse' | 'polygon';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
}

export type DesignNode = TextNode | ImageNode | ShapeNode;

export type ToolType = 'select' | 'text' | 'dynamic' | 'photo' | 'shape' | 'arrow' | 'barcode' | 'pan';

interface DesignState {
  nodes: DesignNode[];
  selectedNodeId: string | null;
  cardWidth: number; // in mm
  cardHeight: number; // in mm

  // View State (preserved when switching tabs)
  stageScale: number;
  stagePos: { x: number, y: number };
  activeTool: ToolType;

  // Actions
  addNode: (node: DesignNode) => void;
  updateNode: (id: string, updates: Partial<DesignNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setCardDimensions: (width: number, height: number) => void;
  setStageScale: (scale: number) => void;
  setStagePos: (pos: { x: number, y: number }) => void;
  setActiveTool: (tool: ToolType) => void;
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      nodes: [],
      selectedNodeId: null,
      cardWidth: 85.60,
      cardHeight: 53.98,

      stageScale: 0, // 0 indicates uninitialized
      stagePos: { x: 0, y: 0 },
      activeTool: 'select',

      addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } as DesignNode : n)),
        })),
      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        })),
      selectNode: (id) => set({ selectedNodeId: id }),
      setCardDimensions: (width, height) => set({ cardWidth: width, cardHeight: height }),

      setStageScale: (scale) => set({ stageScale: scale }),
      setStagePos: (pos) => set({ stagePos: pos }),
      setActiveTool: (tool) => set({ activeTool: tool }),
    }),
    {
      name: 'design-storage',
      // We don't want to persist stageScale/Pos between app restarts necessarily, but we want it between tabs.
      // If we persist it in localstorage, it will stay across restarts which is fine per requirements ("don't reset unless i closed the app").
      // Wait, "unless I closed the app" means we SHOULD NOT persist `stageScale` and `stagePos` in localStorage, only in memory!
      partialize: (state) => ({
        nodes: state.nodes,
        cardWidth: state.cardWidth,
        cardHeight: state.cardHeight,
      }),
    }
  )
);
