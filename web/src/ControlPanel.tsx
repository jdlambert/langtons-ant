import React from 'react';

import './ControlPanel.css';

type ControlPanelProps = {
  running: boolean,
  setRunning: (b: boolean) => void,
  behaviors: string,
  setBehaviors: (s: string) => void,
  size: number,
  setSize: (n: number) => void,
}

const ControlPanel: React.FC<ControlPanelProps> = (
  {running, setRunning, behaviors, setBehaviors, size, setSize}) => {

  const handleBehavior = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (value.toLowerCase().split("").every((c) => c === "l" || c === 'r')) {
      setBehaviors(value);
    }
  }

  const handleSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (!isNaN(value) && value < 2048) {
      setSize(value);
    }
  }

  return <div className="ControlPanel">
         <button onClick={() => setRunning(!running)}>
          {running ? "⏸" : "▶️"}
         </button>
         <input type="text" value={behaviors} onChange={handleBehavior} />
         <input type="number" value={size} onChange={handleSize} />
    </div>
};

export default ControlPanel;