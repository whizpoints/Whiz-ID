import { useDesignStore } from '@/store/useDesignStore';

export function RightProperties() {
  const selectedNodeId = useDesignStore((state) => state.selectedNodeId);

  return (
    <div className="w-64 bg-slate-800 border-l border-slate-700 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-slate-700 font-semibold text-sm text-slate-200">
        Properties
      </div>
      <div className="p-4 text-sm text-slate-400">
        {selectedNodeId ? (
          <div>Editing node: {selectedNodeId}</div>
        ) : (
          <div className="text-center py-8">Select an object to edit its properties</div>
        )}
      </div>
    </div>
  );
}
