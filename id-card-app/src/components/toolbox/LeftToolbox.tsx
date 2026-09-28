import { MousePointer2, Type, Image as ImageIcon, Square, AtSign, ArrowUpRight, Barcode, Hand } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LeftToolbox() {
  return (
    <div className="w-12 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-2 gap-2 flex-shrink-0 z-10">
      <ToolButton icon={<MousePointer2 size={18} />} title="Select / Move (V)" active />
      <ToolButton icon={<Type size={18} />} title="Text (T)" />
      <ToolButton icon={<AtSign size={18} />} title="Dynamic Variable (@)" />
      <ToolButton icon={<ImageIcon size={18} />} title="Photo Container (P)" />
      <ToolButton icon={<Square size={18} />} title="Shape (U)" />
      <ToolButton icon={<ArrowUpRight size={18} />} title="Arrow & Line (L)" />
      <ToolButton icon={<Barcode size={18} />} title="Barcode / QR (B)" />
      <ToolButton icon={<Hand size={18} />} title="Pan (H)" />
    </div>
  );
}

function ToolButton({ icon, title, active }: { icon: React.ReactNode; title: string; active?: boolean }) {
  return (
    <button
      title={title}
      className={cn(
        "p-2 rounded-md transition-colors",
        active ? "bg-blue-500/20 text-blue-500" : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
      )}
    >
      {icon}
    </button>
  );
}
