import { useState } from 'react';
import { FramelessBar } from './components/layout/FramelessBar';
import { AppLayout } from './components/layout/AppLayout';

export type Viewport = 'studio' | 'data' | 'spooler' | 'settings';

function App() {
  const [activeViewport, setActiveViewport] = useState<Viewport>('studio');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 text-slate-200">
      <FramelessBar />
      <AppLayout activeViewport={activeViewport} setActiveViewport={setActiveViewport} />
    </div>
  )
}

export default App;
