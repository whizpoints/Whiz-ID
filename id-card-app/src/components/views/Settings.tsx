import { useDesignStore } from '@/store/useDesignStore';
import { Settings as SettingsIcon, AlertTriangle, Database, Printer, HardDrive, RefreshCcw } from 'lucide-react';

export function Settings() {
  const resetDesign = useDesignStore(state => () => {
    state.setStageScale(0);
    state.setStagePos({ x: 0, y: 0 });
    // clear nodes could also be added here if desired
  });

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-200">
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0 z-10">
        <div className="p-4 border-b border-slate-700 font-semibold text-lg flex items-center gap-2">
          <SettingsIcon size={20} className="text-blue-500" /> App Settings
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button className="w-full text-left px-4 py-2 bg-slate-700 rounded text-sm text-white mb-1 flex items-center gap-2">
              <Database size={16} /> Data Management
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-700/50 rounded text-sm text-slate-400 mb-1 flex items-center gap-2">
              <Printer size={16} /> Hardware Profiles
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-700/50 rounded text-sm text-slate-400 mb-1 flex items-center gap-2">
              <HardDrive size={16} /> Storage & Cache
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Data Management & Reset</h2>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-rose-500/10 rounded-full text-rose-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Danger Zone</h3>
              <p className="text-sm text-slate-400">
                These actions will permanently delete configurations and local cached data from your disk. Make sure you have exported your PDFs.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Reset Canvas View State</h4>
                <p className="text-xs text-slate-400">Recalculates the "Fit to Screen" scaling.</p>
              </div>
              <button
                onClick={resetDesign}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm rounded transition-colors flex items-center gap-2"
              >
                <RefreshCcw size={14} /> Reset View
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-rose-400">Clear All Settings</h4>
                <p className="text-xs text-slate-400">Wipes local storage databases completely.</p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-sm text-white rounded transition-colors"
              >
                Factory Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
