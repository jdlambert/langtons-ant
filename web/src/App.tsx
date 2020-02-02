import React, { useState } from 'react';
import Canvas from './Canvas';
import './App.css';
import ControlPanel from './ControlPanel';

const App: React.FC = () => {
  // Presentational state, doesn't cross into wasm
  const [cellSize, setCellSize] = useState(5);
  const [colors, setColors] =
    useState(["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF"]);
  const [running, setRunning] = useState(true);

  // State that is moved into wasm
  const [height, setHeight] = useState(128);
  const [width, setWidth] = useState(128);
  const [behaviors, setBehaviors] = useState("LRRRRLR");

  const toggleRunning = () => {
    setRunning(!running);
  }

  return <>
    <ControlPanel running={running} toggleRunning={toggleRunning}/>
    <Canvas running={running}
            height={height}
            width={width}
            cellSize={cellSize}
            behaviors={behaviors}
            colors={colors}/>
  </>;
};

export default App;
