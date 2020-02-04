import React from 'react';

import './ControlPanel.css';

type ControlPanelProps = {
  running: boolean,
  setRunning: (b: boolean) => void,
  behaviors: string,
  setBehaviors: (s: string) => void,
}

const ControlPanel: React.FC<ControlPanelProps> = (
  {running, setRunning, behaviors, setBehaviors}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBehaviors(event.target.value);
  }

  return <div className="ControlPanel">
         <button onClick={() => setRunning(!running)}>
          {running ? "⏸" : "▶️"}
         </button>
         <input type="text" value={behaviors} onChange={handleChange} />
    </div>
};

export default ControlPanel;