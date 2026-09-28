import { Viewport } from '@/App';
import { Monitor, TableProperties, Printer, Settings } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TemplateStudio } from '../views/TemplateStudio';
import { DataManager } from '../views/DataManager';
import { PrintSpooler } from '../views/PrintSpooler';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppLayoutProps {
  activeViewport: Viewport;
  setActiveViewport: (v: Viewport) => void;
}

export function AppLayout({ activeViewport, setActiveViewport }: AppLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-16 h-full bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 gap-4 flex-shrink-0 z-20">
        <NavButton
          icon={<Monitor size={24} />}
          active={activeViewport === 'studio'}
          onClick={() => setActiveViewport('studio')}
          title="Template Studio"
        />
        <NavButton
          icon={<TableProperties size={24} />}
          active={activeViewport === 'data'}
          onClick={() => setActiveViewport('data')}
          title="Data & Media"
        />
        <NavButton
          icon={<Printer size={24} />}
          active={activeViewport === 'spooler'}
          onClick={() => setActiveViewport('spooler')}
          title="Print Spooler"
        />
        <div className="flex-1" />
        <NavButton
          icon={<Settings size={24} />}
          active={activeViewport === 'settings'}
          onClick={() => setActiveViewport('settings')}
          title="Settings"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-hidden bg-slate-900">
        {activeViewport === 'studio' && <div className="absolute inset-0"><TemplateStudio /></div>}
        {activeViewport === 'data' && <div className="absolute inset-0"><DataManager /></div>}
        {activeViewport === 'spooler' && <div className="absolute inset-0"><PrintSpooler /></div>}
        {activeViewport === 'settings' && <div className="absolute inset-0 flex items-center justify-center">Settings Placeholder</div>}
      </div>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}

function NavButton({ icon, active, onClick, title }: NavButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl transition-all duration-200 relative group",
        active ? "bg-blue-500/20 text-blue-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-md" />
      )}
      {icon}
    </button>
  );
}
