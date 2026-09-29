import { Maximize, Minus, X } from 'lucide-react';

// Attempt to use electron ipcRenderer, but safely fallback for browser environments
let ipcRenderer: any = null;
try {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.require) {
    // @ts-ignore
    ipcRenderer = window.require('electron').ipcRenderer;
  }
} catch {
  console.log('Not in Electron environment');
}

export function FramelessBar() {
  const handleMinimize = () => {
    if (ipcRenderer) ipcRenderer.send('window-minimize');
  };

  const handleMaximize = () => {
    if (ipcRenderer) ipcRenderer.send('window-maximize');
  };

  const handleClose = () => {
    if (ipcRenderer) ipcRenderer.send('window-close');
  };

  return (
    <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-2 text-slate-300 drag-region select-none w-full z-50 relative">
      <div className="flex items-center gap-2 text-xs font-semibold px-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        WhizCard Studio
      </div>
      <div className="flex no-drag-region h-full absolute right-0 top-0">
        <button
          onClick={handleMinimize}
          className="h-full px-3 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-3 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Maximize size={14} />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3 hover:bg-rose-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
