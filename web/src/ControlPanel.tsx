import React from 'react';

import './ControlPanel.css';

type ControlPanelProps = {
  running: boolean,
  setRunning: (n: any) => void,
}

const ControlPanel: React.FC<ControlPanelProps> = ({running, setRunning}) => {
  return <div className="ControlPanel">
         <button onClick={() => setRunning(!running)}>
          {running ? "⏸" : "▶️"}
         </button>
    </div>
};

export default ControlPanel;