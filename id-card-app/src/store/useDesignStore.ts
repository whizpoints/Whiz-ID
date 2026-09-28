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

interface DesignState {
  nodes: DesignNode[];
  selectedNodeId: string | null;
  cardWidth: number; // in mm
  cardHeight: number; // in mm
  addNode: (node: DesignNode) => void;
  updateNode: (id: string, updates: Partial<DesignNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setCardDimensions: (width: number, height: number) => void;
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      nodes: [],
      selectedNodeId: null,
      cardWidth: 85.60,
      cardHeight: 53.98,
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
    }),
    {
      name: 'design-storage',
    }
  )
);
