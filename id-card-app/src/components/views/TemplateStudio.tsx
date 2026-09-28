import { TopRibbon } from '@/components/ribbon/TopRibbon';
import { LeftToolbox } from '@/components/toolbox/LeftToolbox';
import { RightProperties } from '@/components/properties/RightProperties';
import { BottomPalette } from '@/components/palette/BottomPalette';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';

export function TemplateStudio() {
  return (
    <div className="flex flex-col h-full w-full">
      <TopRibbon />
      <div className="flex flex-1 overflow-hidden">
        <LeftToolbox />
        <DesignCanvas />
        <RightProperties />
      </div>
      <BottomPalette />
    </div>
  );
}
