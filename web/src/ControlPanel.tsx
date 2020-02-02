import React from 'react';

type ControlPanelProps = {
  running: boolean,
  toggleRunning: (n: any) => void,
}

const ControlPanel: React.FC<ControlPanelProps> = ({running, toggleRunning}) => {
  return <div onClick={toggleRunning}>Hello, panel! {running ? "Running!" : "Not running..."}</div>
};

export default ControlPanel;