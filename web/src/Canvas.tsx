import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const TICKS_PER_FRAME = 1000;
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
};

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
        universeRef.current = mod.Universe.new(height, width, behaviors);
        drawGrid(canvasRef.current!, height, width, cellSize);
      }
    }, [mod, height, width, behaviors, cellSize])
    
  return <canvas ref={canvasRef}
                 width={(cellSize + 1) * height + 1}
                 height={(cellSize + 1) * width + 1}/>
}

export default Canvas;