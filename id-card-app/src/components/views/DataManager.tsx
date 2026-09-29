import { useState, useRef } from 'react';
import { useDataStore } from '@/store/useDataStore';
import * as XLSX from 'xlsx';
import { UploadCloud, Folder, CheckCircle2, AlertTriangle, XCircle, Trash2, Plus } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DataManager() {
  const { rows, columns, setColumns, setRows, addRow, deleteRow, photoDirectory, setPhotoDirectory, activeRowIndex, setActiveRowIndex } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length > 0) {
          const cols = Object.keys(json[0] as object);
          setColumns(cols);

          const newRows = json.map((row: any, idx) => ({
            id: `row_${Date.now()}_${idx}`,
            ...row
          }));

          setRows(newRows);
        }
      } catch (err) {
        console.error('Error parsing file:', err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const selectPhotoFolder = async () => {
    // In a real desktop app (Electron/Tauri), this would open a native directory picker
    // For browser demo, we just simulate setting a path
    const mockPath = '/Users/Admin/Documents/ID_Photos_2024';
    setPhotoDirectory(mockPath);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200">
      {/* Header & Controls */}
      <div className="h-20 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Data & Media Manager</h2>
          <p className="text-xs text-slate-400">Map your spreadsheet records and link photo assets.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={selectPhotoFolder}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-sm transition-colors"
          >
            <Folder size={16} />
            {photoDirectory ? 'Change Photo Folder' : 'Link Photo Directory'}
          </button>

          <div className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-md border border-slate-700 font-mono">
            {photoDirectory || 'No directory linked'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Table Area */}
        <div className="flex-1 flex flex-col border-r border-slate-700">
          {rows.length === 0 ? (
            <div
              className={cn(
                "flex-1 flex flex-col items-center justify-center p-8 m-8 border-2 border-dashed rounded-xl transition-colors",
                dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud size={48} className="text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">Drag & Drop Spreadsheet Here</h3>
              <p className="text-sm text-slate-500 mb-6">Supports .xlsx, .xls, and .csv files up to 1000+ rows.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Table Toolbar */}
              <div className="p-3 bg-slate-800/50 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Total Records: <span className="text-white font-medium">{rows.length}</span></span>
                  <div className="h-4 w-px bg-slate-700" />
                  <div className="flex items-center gap-1 text-xs text-emerald-500"><CheckCircle2 size={14}/> {rows.length} Valid</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addRow({ id: `row_${Date.now()}` })}
                    className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
                  >
                    <Plus size={14} /> Add Row
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 px-3 py-1.5 rounded transition-colors border border-blue-500/20"
                  >
                    <UploadCloud size={14} /> Re-upload
                  </button>
                </div>
              </div>

              {/* Virtualized-ready Table container */}
              <div className="flex-1 overflow-auto bg-slate-900">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 bg-slate-800 sticky top-0 z-10 shadow-md">
                    <tr>
                      <th className="px-4 py-3 font-medium w-16 text-center">Status</th>
                      <th className="px-4 py-3 font-medium w-12 text-center">#</th>
                      {columns.map(col => (
                        <th key={col} className="px-4 py-3 font-medium truncate max-w-[200px]">{col}</th>
                      ))}
                      <th className="px-4 py-3 font-medium w-16 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {rows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={cn(
                          "hover:bg-slate-800/50 cursor-pointer transition-colors group",
                          activeRowIndex === idx ? "bg-slate-800 shadow-inner" : ""
                        )}
                        onClick={() => setActiveRowIndex(idx)}
                      >
                        <td className="px-4 py-2 text-center">
                          {/* Mock validation status */}
                          {idx % 5 === 0 && !photoDirectory ? (
                            <XCircle size={16} className="text-rose-500 mx-auto" />
                          ) : idx % 7 === 0 ? (
                            <AlertTriangle size={16} className="text-amber-500 mx-auto" />
                          ) : (
                            <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-2 text-center text-slate-500 font-mono text-xs">{idx + 1}</td>
                        {columns.map(col => (
                          <td key={`${row.id}-${col}`} className="px-4 py-2 truncate max-w-[200px] text-slate-300">
                            {row[col]?.toString() || '-'}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteRow(row.id); }}
                            className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Sidebar */}
        <div className="w-80 bg-slate-800 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-700 font-semibold text-sm text-slate-200">
            Card Preview
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-start overflow-y-auto">
            {rows.length > 0 ? (
              <div className="w-full">
                <div className="text-xs text-slate-400 mb-2 flex justify-between">
                  <span>Record {activeRowIndex + 1} of {rows.length}</span>
                </div>
                {/* Mock Card Preview container */}
                <div className="w-full aspect-[85.6/53.98] bg-slate-200 rounded-xl shadow-lg relative overflow-hidden flex flex-col">
                  {/* Fake Design */}
                  <div className="h-1/3 bg-blue-600 flex items-center px-4">
                    <div className="text-white font-bold text-sm">WhizPoint</div>
                  </div>
                  <div className="flex-1 flex p-3 gap-3 bg-white">
                    <div className="w-16 h-20 bg-slate-300 rounded border-2 border-white shadow-sm flex items-center justify-center text-slate-500 text-[10px]">
                      Photo
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="text-slate-800 font-bold text-xs truncate">
                        {columns.length > 0 ? rows[activeRowIndex]?.[columns[0]]?.toString() || 'Name' : 'Name'}
                      </div>
                      <div className="text-slate-500 text-[10px] truncate">
                        {columns.length > 1 ? rows[activeRowIndex]?.[columns[1]]?.toString() || 'Role' : 'Role'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Validation Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Data Complete</div>
                    </div>
                    {photoDirectory ? (
                      <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Photo Found</div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <div className="flex items-center gap-2"><XCircle size={16} /> Photo Missing</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm text-center mt-12">
                Upload a spreadsheet to see previews.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
