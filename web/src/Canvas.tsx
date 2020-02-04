import React, { useState, useEffect } from 'react';
import { useCrate, useTakeEffect} from './utils/hooks';
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

const Canvas: React.FC<CanvasProps> = ({height, width, cellSize, behaviors, colors, running}) => {

    const mod = useCrate();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    let animationId = React.useRef<number | null>(null);
    const [universe, setUniverse] = useState<Universe | null>(null);

    useEffect(() => {
      
      if (!running && animationId.current !== null) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
        return;
      }

      if (!canvasRef.current) {
        return;
      }
      const canvasContext = canvasRef.current.getContext('2d');
      if (!canvasContext) {
        return;
      }


      const paintDiff = (diff: Uint32Array) => {
        canvasContext.beginPath();

        canvasContext.fillStyle = colors[diff[2]];

        canvasContext.fillRect(
          diff[1] * (cellSize + 1) + 1,
          diff[0] * (cellSize + 1) + 1,
          cellSize,
          cellSize);

        canvasContext.stroke();
      };

      const renderLoop = () => {
        if (universe !== null) {
          for (let i = 0; i < TICKS_PER_FRAME; i++) {
            paintDiff(universe.tick());
          }
          animationId.current = requestAnimationFrame(renderLoop);
        }
      };

      animationId.current = requestAnimationFrame(renderLoop);

    }, [running, universe])

    useEffect(() => {
      if (!canvasRef.current) {
        return;
      }
      const canvasContext = canvasRef.current.getContext('2d');
      if (!canvasContext) {
        return;
      }
      canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
    }, [height, width, behaviors, canvasRef])
    
    useTakeEffect(() => setUniverse(mod.Universe.new(height, width, behaviors))
    , [mod, height, width, behaviors]);

  return <canvas ref={canvasRef}
                 width={(cellSize + 1) * height + 1}
                 height={(cellSize + 1) * width + 1}/>
}

export default Canvas;