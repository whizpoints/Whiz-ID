import { useDesignStore } from '@/store/useDesignStore';

export function BottomPalette() {
  const cardWidth = useDesignStore((state) => state.cardWidth);
  const cardHeight = useDesignStore((state) => state.cardHeight);

  const swatches = ['#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

  return (
    <div className="h-10 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-4 flex-shrink-0 text-xs text-slate-400 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {swatches.map((color) => (
            <button
              key={color}
              className="w-5 h-5 rounded-sm border border-slate-600 shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>CR80: {cardWidth} x {cardHeight} mm</div>
      </div>
    </div>
  );
}
