import React from 'react';
import {useCrate, useTakeEffect} from './utils/hooks';

type CanvasProps = {
  height: number,
  width: number,
  cell_size: number,
  behaviors: string,
  colors: string[],
}

const GRID_COLOR = "#CCCCCC";

const Canvas: React.FC<CanvasProps> = ({height, width, cell_size, behaviors, colors}) => {

    const mod = useCrate();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useTakeEffect(() => {
      
      const universe = mod.Universe.new(height, width, behaviors);
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
          ctx.moveTo(i * (cell_size + 1) + 1, 0);
          ctx.lineTo(i * (cell_size + 1) + 1, (cell_size + 1) * height + 1);
        }

        // Horizontal lines.
        for (let j = 0; j <= height; j++) {
          ctx.moveTo(0,                           j * (cell_size + 1) + 1);
          ctx.lineTo((cell_size + 1) * width + 1, j * (cell_size + 1) + 1);
        }

        ctx.stroke();
      };

      const paintDiff = (diff: number[]) => {
        ctx.beginPath();

        ctx.fillStyle = colors[diff[2]];

        ctx.fillRect(
          diff[1] * (cell_size + 1) + 1,
          diff[0] * (cell_size + 1) + 1,
          cell_size,
          cell_size);

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

  return <canvas ref={canvasRef}
                 width={(cell_size + 1) * height + 1}
                 height={(cell_size + 1) * width + 1}/>
}

export default Canvas;