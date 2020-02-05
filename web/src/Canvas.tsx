import React, { useState, useEffect } from 'react';
import { useCrate, useTakeEffect } from './utils/hooks';
import { Universe } from './crate';

type CanvasProps = {
  running: boolean,
  height: number,
  width: number,
  cellSize: number,
  behaviors: string,
  colors: string[],
}

const TICKS_PER_FRAME = 1;
const GRID_COLOR = "#CCCCCC";

const drawGrid = (canvas: HTMLCanvasElement, height: number, width: number, cellSize: number) => {

    const canvasContext = canvas.getContext('2d')!;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    canvasContext.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      canvasContext.moveTo(i * (cellSize + 1) + 1, 0);
      canvasContext.lineTo(i * (cellSize + 1) + 1, (cellSize + 1) * height + 1);
    }
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      canvasContext.moveTo(0, j * (cellSize + 1) + 1);
      canvasContext.lineTo((cellSize + 1) * width + 1, j * (cellSize + 1) + 1);
    }

    canvasContext.stroke();
}

const paintDiff = (diff: Uint32Array,
                    canvasContext: CanvasRenderingContext2D,
                    colors: string[],
                    cellSize: number) => {
  canvasContext.beginPath();

  canvasContext.fillStyle = colors[diff[2]];

  canvasContext.fillRect(
    diff[1] * (cellSize + 1) + 1,
    diff[0] * (cellSize + 1) + 1,
    cellSize,
    cellSize);

  canvasContext.stroke();
};


const Canvas: React.FC<CanvasProps> = ({height, width, cellSize, behaviors, colors, running}) => {

    const mod = useCrate();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [animationId, setAnimationId] = useState<number | null>(null);
    const [universe, setUniverse] = useState<Universe | null>(null);

    useEffect(() => {
      if (!running && animationId !== null) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
        return;
      }
    }, [running, animationId]);

    useTakeEffect(() => {
      const canvas = canvasRef.current!;
      setUniverse(mod.Universe.new(height, width, behaviors));
      drawGrid(canvas, height, width, cellSize);
    }, [mod, height, width, behaviors, cellSize, canvasRef.current])
    
    useTakeEffect(() => {
      const canvasContext = canvasRef.current!.getContext('2d')!;

      const renderLoop = () => {
          for (let i = 0; i < TICKS_PER_FRAME; i++) {
            paintDiff(universe!.tick(), canvasContext, colors, cellSize);
          }
          setAnimationId(requestAnimationFrame(renderLoop))
      };

      setAnimationId(requestAnimationFrame(renderLoop));
    }, [universe, colors, cellSize, canvasRef.current]);

  return <canvas ref={canvasRef}
                 width={(cellSize + 1) * height + 1}
                 height={(cellSize + 1) * width + 1}/>
}

export default Canvas;