import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCrate, useTakeEffect } from './utils/hooks';
import { Universe } from './crate';

type CanvasProps = {
  running: boolean,
  size: number,
  cellSize: number,
  behaviors: string,
  colors: string[],
}

const TICKS_PER_FRAME = 250;
const GRID_COLOR = "#CCCCCC";

const drawGrid = (canvas: HTMLCanvasElement, size: number, cellSize: number) => {
    const canvasContext = canvas.getContext('2d')!;
    canvasContext.clearRect(0, 0, canvas.height, canvas.width);
    canvasContext.beginPath();
    canvasContext.strokeStyle = GRID_COLOR;

    for (let j = 0; j <= size; j++) {
      // Vertical lines.
      canvasContext.moveTo(j * (cellSize + 1) + 1, 0);
      canvasContext.lineTo(j * (cellSize + 1) + 1, (cellSize + 1) * size + 1);

      // Horizontal lines.
      canvasContext.moveTo(0, j * (cellSize + 1) + 1);
      canvasContext.lineTo((cellSize + 1) * size + 1, j * (cellSize + 1) + 1);
    }

    canvasContext.stroke();
};

const paintDiff = (diff: Uint32Array,
                   canvasContext: CanvasRenderingContext2D,
                   colors: string[],
                   cellSize: number) => {
  canvasContext.beginPath();

  canvasContext.fillStyle = colors[diff[2] % colors.length];

  canvasContext.fillRect(
    diff[1] * (cellSize + 1) + 1,
    diff[0] * (cellSize + 1) + 1,
    cellSize,
    cellSize);

  canvasContext.stroke();
};

const Canvas: React.FC<CanvasProps> = ({size, cellSize, behaviors, colors, running}) => {
    const mod = useCrate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let animationRef = useRef<number | null>(null);
    let universeRef = useRef<Universe | null>(null);
    
    const renderLoop = useCallback(() => {
      for (let i = 0; i < TICKS_PER_FRAME; i++) {
        paintDiff(universeRef.current!.tick(), canvasRef.current!.getContext("2d")!, colors, cellSize);
      }
      animationRef.current = requestAnimationFrame(renderLoop);
    }, [colors, cellSize])

    const startLoop = () => {
      if (universeRef.current && canvasRef.current && animationRef.current == null) {
        animationRef.current = requestAnimationFrame(renderLoop);
      }
    }

    const stopLoop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    useEffect(() => {
      if (universeRef.current && canvasRef.current) {
        if (running) {
          startLoop();
        } else {
          stopLoop();
        }
      }
    }, [running]);

    useTakeEffect(() => {
      if (canvasRef.current) {
        universeRef.current = mod.Universe.new(size, size, behaviors);
        drawGrid(canvasRef.current!, size, cellSize);
      }
    }, [mod, size, size, behaviors, cellSize])
   
  const fullSize = (cellSize + 1) * size + 1

  return <canvas ref={canvasRef} height={fullSize} width={fullSize}/>
}

export default Canvas;