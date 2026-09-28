import { Maximize, Minus, X } from 'lucide-react';

export function FramelessBar() {
  return (
    <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-2 text-slate-300 drag-region select-none w-full">
      <div className="flex items-center gap-2 text-xs font-semibold px-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        Enterprise ID Card Studio
      </div>
      <div className="flex no-drag-region h-full">
        <button className="h-full px-3 hover:bg-slate-700 hover:text-white transition-colors">
          <Minus size={14} />
        </button>
        <button className="h-full px-3 hover:bg-slate-700 hover:text-white transition-colors">
          <Maximize size={14} />
        </button>
        <button className="h-full px-3 hover:bg-rose-500 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
