import React from 'react';

type ControlPanelProps = {
  running: boolean,
  setRunning: (n: any) => void,
}

const ControlPanel: React.FC<ControlPanelProps> = ({running, setRunning}) => {
  return <div onClick={() => setRunning(!running)}>Hello, panel! {running ? "Running!" : "Not running..."}</div>
};

export default ControlPanel;