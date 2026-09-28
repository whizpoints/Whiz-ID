import { Stage, Layer, Rect } from 'react-konva';
import { useDesignStore } from '@/store/useDesignStore';
import { useEffect, useRef, useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';

const PIXELS_PER_MM = 4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

export function DesignCanvas() {
  const cardWidth = useDesignStore((state) => state.cardWidth);
  const cardHeight = useDesignStore((state) => state.cardHeight);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const cardPixelWidth = cardWidth * PIXELS_PER_MM;
  const cardPixelHeight = cardHeight * PIXELS_PER_MM;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setStageSize({ width, height });

        if (!isInitialized && width > 0) {
          // Fit to screen with some padding
          const padding = 40;
          const scaleX = (width - padding * 2) / cardPixelWidth;
          const scaleY = (height - padding * 2) / cardPixelHeight;
          const initialScale = Math.min(scaleX, scaleY, 2); // cap max initial zoom

          setStageScale(initialScale);
          setStagePos({
            x: (width - cardPixelWidth * initialScale) / 2,
            y: (height - cardPixelHeight * initialScale) / 2
          });
          setIsInitialized(true);
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [cardPixelWidth, cardPixelHeight, isInitialized]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Zoom in or out based on scroll direction
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      setStagePos({ x: stage.x(), y: stage.y() });
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-900 relative overflow-hidden" ref={containerRef}>
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />

      {stageSize.width > 0 && (
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <Layer>
            {/* Card Drop Shadow / Background */}
            <Rect
              x={0}
              y={0}
              width={cardPixelWidth}
              height={cardPixelHeight}
              fill="#E2E8F0"
              shadowColor="black"
              shadowBlur={20 / stageScale}
              shadowOffset={{ x: 0, y: 10 / stageScale }}
              shadowOpacity={0.3}
              cornerRadius={12}
            />
            {/* Card Content Area - Clip */}
            <Rect
              x={0}
              y={0}
              width={cardPixelWidth}
              height={cardPixelHeight}
              fill="#FFFFFF"
              cornerRadius={12}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
}
