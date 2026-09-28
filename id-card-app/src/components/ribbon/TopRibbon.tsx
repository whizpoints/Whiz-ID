import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Save, FolderOpen, FilePlus, Download, Copy, Scissors, ClipboardPaste, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function TopRibbon() {
  return (
    <div className="h-32 bg-slate-800 border-b border-slate-700 flex flex-col flex-shrink-0">
      <Tabs defaultValue="home" className="w-full flex flex-col h-full">
        <TabsList className="flex bg-slate-900 border-b border-slate-700 px-2 pt-2 gap-1">
          <TabsTrigger value="file" className="px-4 py-1.5 rounded-t-lg text-sm text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 data-[state=active]:border-t data-[state=active]:border-x data-[state=active]:border-slate-700">File</TabsTrigger>
          <TabsTrigger value="home" className="px-4 py-1.5 rounded-t-lg text-sm text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 data-[state=active]:border-t data-[state=active]:border-x data-[state=active]:border-slate-700">Home</TabsTrigger>
          <TabsTrigger value="insert" className="px-4 py-1.5 rounded-t-lg text-sm text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 data-[state=active]:border-t data-[state=active]:border-x data-[state=active]:border-slate-700">Insert</TabsTrigger>
          <TabsTrigger value="arrange" className="px-4 py-1.5 rounded-t-lg text-sm text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 data-[state=active]:border-t data-[state=active]:border-x data-[state=active]:border-slate-700">Arrange</TabsTrigger>
          <TabsTrigger value="view" className="px-4 py-1.5 rounded-t-lg text-sm text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 data-[state=active]:border-t data-[state=active]:border-x data-[state=active]:border-slate-700">View</TabsTrigger>
        </TabsList>

        <div className="flex-1 px-4 py-2 bg-slate-800">
          <TabsContent value="file" className="flex h-full items-center gap-4 outline-none">
            <RibbonGroup title="Project">
              <RibbonButton icon={<FilePlus size={20} />} label="New" />
              <RibbonButton icon={<FolderOpen size={20} />} label="Open" />
              <RibbonButton icon={<Save size={20} />} label="Save" />
            </RibbonGroup>
            <RibbonDivider />
            <RibbonGroup title="Export">
              <RibbonButton icon={<Download size={20} />} label="Export PDF" />
            </RibbonGroup>
          </TabsContent>

          <TabsContent value="home" className="flex h-full items-center gap-4 outline-none">
            <RibbonGroup title="Clipboard">
              <div className="flex flex-col gap-1 mr-2">
                <RibbonSmallButton icon={<Copy size={14} />} label="Copy" />
                <RibbonSmallButton icon={<Scissors size={14} />} label="Cut" />
              </div>
              <RibbonButton icon={<ClipboardPaste size={20} />} label="Paste" />
            </RibbonGroup>
            <RibbonDivider />
            <RibbonGroup title="Font">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <select className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 outline-none w-32">
                    <option>Inter</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                  </select>
                  <select className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 outline-none w-16">
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <RibbonSmallIconButton icon={<Bold size={14} />} />
                  <RibbonSmallIconButton icon={<Italic size={14} />} />
                  <RibbonSmallIconButton icon={<Underline size={14} />} />
                </div>
              </div>
            </RibbonGroup>
            <RibbonDivider />
            <RibbonGroup title="Alignment">
              <div className="flex items-center gap-1">
                <RibbonSmallIconButton icon={<AlignLeft size={14} />} />
                <RibbonSmallIconButton icon={<AlignCenter size={14} />} />
                <RibbonSmallIconButton icon={<AlignRight size={14} />} />
              </div>
            </RibbonGroup>
          </TabsContent>

          <TabsContent value="insert" className="flex h-full items-center gap-4 outline-none">
            <div className="text-sm text-slate-400">Insert tools coming soon</div>
          </TabsContent>
          <TabsContent value="arrange" className="flex h-full items-center gap-4 outline-none">
            <div className="text-sm text-slate-400">Arrange tools coming soon</div>
          </TabsContent>
          <TabsContent value="view" className="flex h-full items-center gap-4 outline-none">
            <div className="text-sm text-slate-400">View tools coming soon</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function RibbonGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center h-full justify-between pb-1">
      <div className="flex items-center h-full gap-1">{children}</div>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{title}</span>
    </div>
  );
}

function RibbonDivider() {
  return <div className="w-px h-12 bg-slate-700 mx-2" />;
}

function RibbonButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors w-16 h-14 gap-1">
      {icon}
      <span className="text-[10px] whitespace-nowrap">{label}</span>
    </button>
  );
}

function RibbonSmallButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors text-xs">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function RibbonSmallIconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors">
      {icon}
    </button>
  );
}
