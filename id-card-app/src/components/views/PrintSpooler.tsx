import { useState } from 'react';
import { useTrayStore } from '@/store/useTrayStore';
import { useDataStore } from '@/store/useDataStore';
import { useDesignStore } from '@/store/useDesignStore';
import { Printer, Settings2, Download, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function PrintSpooler() {
  const { profiles, activeProfileId, setActiveProfile, updateProfile } = useTrayStore();
  const { rows } = useDataStore();
  const { cardWidth, cardHeight } = useDesignStore();

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const totalRecords = rows.length;
  const totalTrays = Math.ceil(totalRecords / 2);

  const [currentTrayPage, setCurrentTrayPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate rendering time
      await new Promise(r => setTimeout(r, 1000));

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < totalTrays; i++) {
        if (i > 0) doc.addPage();

        // Slot 1 (Top)
        const record1Idx = i * 2;
        if (record1Idx < totalRecords) {
          doc.setDrawColor(200, 200, 200);
          doc.rect(
            activeProfile.globalMarginX + activeProfile.slot1OffsetX,
            activeProfile.globalMarginY + activeProfile.slot1OffsetY,
            cardWidth,
            cardHeight,
            'S'
          );
          doc.text(`Card ${record1Idx + 1}`,
            activeProfile.globalMarginX + activeProfile.slot1OffsetX + 5,
            activeProfile.globalMarginY + activeProfile.slot1OffsetY + 10
          );
        }

        // Slot 2 (Bottom)
        const record2Idx = i * 2 + 1;
        if (record2Idx < totalRecords) {
          const slot2Y = activeProfile.globalMarginY + cardHeight + activeProfile.interCardGap;
          doc.rect(
            activeProfile.globalMarginX + activeProfile.slot2OffsetX,
            slot2Y + activeProfile.slot2OffsetY,
            cardWidth,
            cardHeight,
            'S'
          );
          doc.text(`Card ${record2Idx + 1}`,
            activeProfile.globalMarginX + activeProfile.slot2OffsetX + 5,
            slot2Y + activeProfile.slot2OffsetY + 10
          );
        }
      }

      doc.save('ID_Cards_Batch.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-200">
      {/* Left Settings Panel */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0 z-10">
        <div className="p-4 border-b border-slate-700 font-semibold text-lg flex items-center gap-2">
          <Settings2 size={20} className="text-blue-500" /> Print Settings
        </div>

        <div className="p-4 flex flex-col gap-6 overflow-y-auto">
          {/* Profile Select */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Hardware Profile</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 outline-none"
              value={activeProfileId}
              onChange={(e) => setActiveProfile(e.target.value)}
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Calibration Inputs */}
          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-slate-400 uppercase flex items-center justify-between">
              Calibration Offsets
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Saved</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Global X (mm)</span>
                <input
                  type="number" step="0.1"
                  value={activeProfile.globalMarginX}
                  onChange={(e) => updateProfile(activeProfile.id, { globalMarginX: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Global Y (mm)</span>
                <input
                  type="number" step="0.1"
                  value={activeProfile.globalMarginY}
                  onChange={(e) => updateProfile(activeProfile.id, { globalMarginY: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3 flex flex-col gap-3">
              <span className="text-xs text-slate-400 font-medium">Slot 1 (Top) Fine Tuning</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Offset X</span>
                  <input type="number" step="0.1" value={activeProfile.slot1OffsetX} onChange={(e) => updateProfile(activeProfile.id, { slot1OffsetX: parseFloat(e.target.value) || 0 })} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Offset Y</span>
                  <input type="number" step="0.1" value={activeProfile.slot1OffsetY} onChange={(e) => updateProfile(activeProfile.id, { slot1OffsetY: parseFloat(e.target.value) || 0 })} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3 flex flex-col gap-3">
              <span className="text-xs text-slate-400 font-medium">Slot 2 (Bottom) Fine Tuning</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Offset X</span>
                  <input type="number" step="0.1" value={activeProfile.slot2OffsetX} onChange={(e) => updateProfile(activeProfile.id, { slot2OffsetX: parseFloat(e.target.value) || 0 })} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Offset Y</span>
                  <input type="number" step="0.1" value={activeProfile.slot2OffsetY} onChange={(e) => updateProfile(activeProfile.id, { slot2OffsetY: parseFloat(e.target.value) || 0 })} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex flex-col gap-1 w-1/2">
                <span className="text-xs text-slate-500">Inter-Card Gap (mm)</span>
                <input type="number" step="0.1" value={activeProfile.interCardGap} onChange={(e) => updateProfile(activeProfile.id, { interCardGap: parseFloat(e.target.value) || 0 })} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-sm w-full text-center" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-slate-700 bg-slate-800/80">
          <button
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-md font-medium text-sm transition-colors mb-3"
          >
            Print Calibration Page
          </button>

          <button
            disabled={totalRecords === 0 || isExporting}
            onClick={handleExportPDF}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
            {isExporting ? 'Generating PDF...' : 'Export Batch to PDF'}
          </button>

          <button
            disabled={totalRecords === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-3 shadow-lg shadow-emerald-500/20"
          >
            <Play size={18} /> Direct Spool Print
          </button>
        </div>
      </div>

      {/* Main A4 Preview Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
        {/* Toolbar */}
        <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h3 className="font-medium text-slate-300">Tray Preview</h3>
            {totalTrays > 0 && (
              <div className="flex items-center gap-2 text-sm bg-slate-900 border border-slate-700 rounded-md p-1">
                <button
                  onClick={() => setCurrentTrayPage(p => Math.max(1, p - 1))}
                  className="px-2 py-0.5 hover:bg-slate-700 rounded"
                >
                  &larr;
                </button>
                <span className="w-24 text-center text-slate-400">
                  Tray {currentTrayPage} / {totalTrays}
                </span>
                <button
                  onClick={() => setCurrentTrayPage(p => Math.min(totalTrays, p + 1))}
                  className="px-2 py-0.5 hover:bg-slate-700 rounded"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" /> Ensure EPSON tray is inserted before printing
          </div>
        </div>

        {/* A4 Sheet Renderer */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[#0B1121]">
          {totalRecords > 0 ? (
            <div
              className="bg-white shadow-2xl relative"
              style={{
                width: '210mm', // A4 width
                height: '297mm', // A4 height
                transform: 'scale(0.8)',
                transformOrigin: 'center center'
              }}
            >
              {/* Grid / Rules for calibration visualization */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10mm 10mm' }} />

              {/* Global Tray Container applied via margins */}
              <div
                className="absolute border border-blue-500/30 border-dashed"
                style={{
                  left: `${activeProfile.globalMarginX}mm`,
                  top: `${activeProfile.globalMarginY}mm`,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none'
                }}
              >
                {/* Slot 1 (Top Card) */}
                <div
                  className="absolute border-2 border-slate-800 bg-slate-100 flex items-center justify-center shadow-lg"
                  style={{
                    width: `${cardWidth}mm`,
                    height: `${cardHeight}mm`,
                    left: `${activeProfile.slot1OffsetX}mm`,
                    top: `${activeProfile.slot1OffsetY}mm`
                  }}
                >
                  <div className="text-slate-400 text-center">
                    <div className="font-bold text-slate-800">Card {(currentTrayPage - 1) * 2 + 1}</div>
                    <div className="text-xs mt-2">Mock Content Rendered</div>
                  </div>
                </div>

                {/* Slot 2 (Bottom Card) */}
                {((currentTrayPage - 1) * 2 + 1) < totalRecords && (
                  <div
                    className="absolute border-2 border-slate-800 bg-slate-100 flex items-center justify-center shadow-lg"
                    style={{
                      width: `${cardWidth}mm`,
                      height: `${cardHeight}mm`,
                      left: `${activeProfile.slot2OffsetX}mm`,
                      top: `${cardHeight + activeProfile.interCardGap + activeProfile.slot2OffsetY}mm`
                    }}
                  >
                    <div className="text-slate-400 text-center">
                      <div className="font-bold text-slate-800">Card {(currentTrayPage - 1) * 2 + 2}</div>
                      <div className="text-xs mt-2">Mock Content Rendered</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 flex flex-col items-center gap-4">
              <Printer size={48} className="text-slate-700" />
              <p>No records loaded. Go to Data & Media to import data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
