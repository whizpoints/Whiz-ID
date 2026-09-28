import { Stage, Layer, Rect } from 'react-konva';
import { useDesignStore } from '@/store/useDesignStore';
import { useEffect, useRef, useState } from 'react';

// A4 at 300 DPI is approx 2480 x 3508 pixels.
// Conversion: 1 mm = 3.7795275591 px (approx 3.78) for 96 DPI screen
// Or use a fixed scale. Let's use 4px per mm for rendering on screen.
const PIXELS_PER_MM = 4;

export function DesignCanvas() {
  const cardWidth = useDesignStore((state) => state.cardWidth);
  const cardHeight = useDesignStore((state) => state.cardHeight);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cardPixelWidth = cardWidth * PIXELS_PER_MM;
  const cardPixelHeight = cardHeight * PIXELS_PER_MM;

  const stageX = (stageSize.width - cardPixelWidth) / 2;
  const stageY = (stageSize.height - cardPixelHeight) / 2;

  return (
    <div className="flex-1 h-full bg-slate-900 relative overflow-hidden" ref={containerRef}>
      {/* Background pattern for "neutral backdrop" */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />

      {stageSize.width > 0 && (
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            {/* Card Drop Shadow / Background */}
            <Rect
              x={stageX}
              y={stageY}
              width={cardPixelWidth}
              height={cardPixelHeight}
              fill="#E2E8F0" // neutral backdrop
              shadowColor="black"
              shadowBlur={20}
              shadowOffset={{ x: 0, y: 10 }}
              shadowOpacity={0.3}
              cornerRadius={12} // typical rounded corner for CR80
            />
            {/* Card Content Area - Clip */}
            <Rect
              x={stageX}
              y={stageY}
              width={cardPixelWidth}
              height={cardPixelHeight}
              fill="#FFFFFF"
              cornerRadius={12}
            />

            {/* Node Rendering will go here */}

          </Layer>
        </Stage>
      )}
    </div>
  );
}
