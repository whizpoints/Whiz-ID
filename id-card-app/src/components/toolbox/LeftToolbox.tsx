import { MousePointer2, Type, Image as ImageIcon, Square, AtSign, ArrowUpRight, Barcode, Hand } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useDesignStore } from '@/store/useDesignStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LeftToolbox() {
  const { activeTool, setActiveTool } = useDesignStore();

  return (
    <div className="w-12 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-2 gap-2 flex-shrink-0 z-10">
      <ToolButton
        icon={<MousePointer2 size={18} />}
        title="Select / Move (V)"
        active={activeTool === 'select'}
        onClick={() => setActiveTool('select')}
      />
      <ToolButton
        icon={<Type size={18} />}
        title="Text (T)"
        active={activeTool === 'text'}
        onClick={() => setActiveTool('text')}
      />
      <ToolButton
        icon={<AtSign size={18} />}
        title="Dynamic Variable (@)"
        active={activeTool === 'dynamic'}
        onClick={() => setActiveTool('dynamic')}
      />
      <ToolButton
        icon={<ImageIcon size={18} />}
        title="Photo Container (P)"
        active={activeTool === 'photo'}
        onClick={() => setActiveTool('photo')}
      />
      <ToolButton
        icon={<Square size={18} />}
        title="Shape (U)"
        active={activeTool === 'shape'}
        onClick={() => setActiveTool('shape')}
      />
      <ToolButton
        icon={<ArrowUpRight size={18} />}
        title="Arrow & Line (L)"
        active={activeTool === 'arrow'}
        onClick={() => setActiveTool('arrow')}
      />
      <ToolButton
        icon={<Barcode size={18} />}
        title="Barcode / QR (B)"
        active={activeTool === 'barcode'}
        onClick={() => setActiveTool('barcode')}
      />
      <ToolButton
        icon={<Hand size={18} />}
        title="Pan (H)"
        active={activeTool === 'pan'}
        onClick={() => setActiveTool('pan')}
      />
    </div>
  );
}

function ToolButton({ icon, title, active, onClick }: { icon: React.ReactNode; title: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-colors",
        active ? "bg-blue-500/20 text-blue-500" : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
      )}
    >
      {icon}
    </button>
  );
}
