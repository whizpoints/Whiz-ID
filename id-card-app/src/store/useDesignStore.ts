import { create } from 'zustand';

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
  activeTool: ToolType;

  // We add these back since they were missing, which caused typescript failure, but keep persist off
  // as requested earlier since it triggered bugs. We use Zustand's memory to keep it between tab swaps.
  stageScale: number;
  stagePos: { x: number, y: number };

  // Actions
  addNode: (node: DesignNode) => void;
  updateNode: (id: string, updates: Partial<DesignNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setCardDimensions: (width: number, height: number) => void;
  setActiveTool: (tool: ToolType) => void;
  setStageScale: (scale: number) => void;
  setStagePos: (pos: { x: number, y: number }) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  nodes: [],
  selectedNodeId: null,
  cardWidth: 85.60,
  cardHeight: 53.98,

  activeTool: 'select',
  stageScale: 0,
  stagePos: { x: 0, y: 0 },

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
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStageScale: (scale) => set({ stageScale: scale }),
  setStagePos: (pos) => set({ stagePos: pos }),
}));
