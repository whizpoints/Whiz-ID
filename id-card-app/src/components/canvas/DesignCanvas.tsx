import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import { useDesignStore } from '@/store/useDesignStore';
import { useEffect, useRef, useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';

const PIXELS_PER_MM = 4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

export function DesignCanvas() {
  const {
    cardWidth, cardHeight,
    stageScale, stagePos,
    setStageScale, setStagePos,
    activeTool, setActiveTool,
    nodes, selectedNodeId, selectNode,
    addNode, updateNode
  } = useDesignStore();

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const cardPixelWidth = cardWidth * PIXELS_PER_MM;
  const cardPixelHeight = cardHeight * PIXELS_PER_MM;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setStageSize({ width, height });

        if (stageScale === 0 && width > 0) {
          // Fit to screen with some padding on first load
          const padding = 40;
          const scaleX = (width - padding * 2) / cardPixelWidth;
          const scaleY = (height - padding * 2) / cardPixelHeight;
          const initialScale = Math.min(scaleX, scaleY, 2);

          setStageScale(initialScale);
          setStagePos({
            x: (width - cardPixelWidth * initialScale) / 2,
            y: (height - cardPixelHeight * initialScale) / 2
          });
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [cardPixelWidth, cardPixelHeight, stageScale, setStageScale, setStagePos]);

  useEffect(() => {
    // Attach transformer to selected node
    if (selectedNodeId && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedNodeId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedNodeId, nodes]);

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
    if (stage && e.target === stage) {
      setStagePos({ x: stage.x(), y: stage.y() });
    }
  };

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.hasName('bg-rect');
    if (clickedOnEmpty) {
      selectNode(null);
    }
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    checkDeselect(e);

    if (activeTool !== 'select' && activeTool !== 'pan') {
      const stage = e.target.getStage();
      const pointer = stage?.getPointerPosition();
      if (!pointer || !stage) return;

      const scale = stage.scaleX();
      const x = (pointer.x - stage.x()) / scale;
      const y = (pointer.y - stage.y()) / scale;

      const id = `node_${Date.now()}`;

      if (activeTool === 'text' || activeTool === 'dynamic') {
        addNode({
          id,
          type: 'text',
          x,
          y,
          width: 100,
          height: 30,
          rotation: 0,
          text: activeTool === 'dynamic' ? '{{Field}}' : 'New Text',
          fontSize: 16,
          fontFamily: 'Inter',
          fill: '#0f172a',
          align: 'left',
          isDynamic: activeTool === 'dynamic'
        });
      } else if (activeTool === 'shape' || activeTool === 'photo') {
        addNode({
          id,
          type: 'shape',
          shapeType: 'rect',
          x,
          y,
          width: 80,
          height: 100,
          rotation: 0,
          fill: activeTool === 'photo' ? '#cbd5e1' : '#3b82f6',
          stroke: '#1e293b',
          strokeWidth: 2,
          cornerRadius: activeTool === 'photo' ? 4 : 8
        });
      }

      setActiveTool('select');
      selectNode(id);
    }
  };

  const handleNodeDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateNode(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (_e: KonvaEventObject<Event>, id: string) => {
    const node = stageRef.current.findOne(`#${id}`);
    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);

      updateNode(id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    }
  };

  const getCursor = () => {
    if (activeTool === 'pan') return 'cursor-grab active:cursor-grabbing';
    if (activeTool !== 'select') return 'cursor-crosshair';
    return 'cursor-default';
  };

  return (
    <div className={`flex-1 h-full bg-slate-900 relative overflow-hidden ${getCursor()}`} ref={containerRef}>
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />

      {stageSize.width > 0 && stageScale > 0 && (
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onWheel={handleWheel}
          onClick={handleStageClick}
          onTap={handleStageClick}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable={activeTool === 'pan'}
          onDragEnd={handleDragEnd}
        >
          <Layer>
            {/* Background & Clip Container */}
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
            <Rect
              name="bg-rect"
              x={0}
              y={0}
              width={cardPixelWidth}
              height={cardPixelHeight}
              fill="#FFFFFF"
              cornerRadius={12}
            />

            {/* Render Nodes */}
            {nodes.map((node) => {
              if (node.type === 'text') {
                return (
                  <Text
                    key={node.id}
                    id={node.id}
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rotation={node.rotation}
                    text={node.text}
                    fontSize={node.fontSize}
                    fontFamily={node.fontFamily}
                    fill={node.fill}
                    align={node.align}
                    draggable={activeTool === 'select'}
                    onClick={() => selectNode(node.id)}
                    onDragEnd={(e) => handleNodeDragEnd(e, node.id)}
                    onTransformEnd={(e) => handleTransformEnd(e, node.id)}
                  />
                );
              }
              if (node.type === 'shape') {
                return (
                  <Rect
                    key={node.id}
                    id={node.id}
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rotation={node.rotation}
                    fill={node.fill}
                    stroke={node.stroke}
                    strokeWidth={node.strokeWidth}
                    cornerRadius={node.cornerRadius}
                    draggable={activeTool === 'select'}
                    onClick={() => selectNode(node.id)}
                    onDragEnd={(e) => handleNodeDragEnd(e, node.id)}
                    onTransformEnd={(e) => handleTransformEnd(e, node.id)}
                  />
                );
              }
              return null;
            })}

            {/* Transformer */}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
              borderStroke="#3b82f6"
              anchorStroke="#3b82f6"
              anchorFill="#ffffff"
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
}
