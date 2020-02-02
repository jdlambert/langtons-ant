import React, { useRef } from 'react';
import {useCrate, useTakeEffect} from './utils/hooks';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
    const mod = useCrate();

    const height = 1024;
    const width = 1024
    const CELL_SIZE = 1;
    const GRID_COLOR = "#CCCCCC";
    const COLORS = ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF"];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useTakeEffect(() => {

      const universe = mod.Universe.new(height, width);
      if (!canvasRef.current) {
        console.log("No canvas ref!")
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.log("No context!")
        return;
      }

      const drawGrid = () => {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;

        // Vertical lines.
        for (let i = 0; i <= width; i++) {
          ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
          ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
        }

        // Horizontal lines.
        for (let j = 0; j <= height; j++) {
          ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
          ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
        }

        ctx.stroke();
      };

      const paintDiff = (diff: number[]) => {
        ctx.beginPath();

        ctx.fillStyle = COLORS[diff[2]];

        ctx.fillRect(
          diff[1] * (CELL_SIZE + 1) + 1,
          diff[0] * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE);

        ctx.stroke();
      };

      const TICKS_PER_FRAME = 100;

      const renderLoop = () => {
        for (let i = 0; i < TICKS_PER_FRAME; i++) {
          let diff = universe.tick();
          paintDiff(diff);
        }

        requestAnimationFrame(renderLoop);
      };

      drawGrid();
      requestAnimationFrame(renderLoop);
    
    }, [mod]);

  return (
      <div>
        <canvas ref={canvasRef} width={(CELL_SIZE + 1) * height + 1} height={(CELL_SIZE + 1) * width + 1} />
      </div>
  );
};

export default App;
