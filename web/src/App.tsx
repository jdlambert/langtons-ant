import React, { useState } from 'react';
import Canvas from './Canvas';
import './App.css';
import ControlPanel from './ControlPanel';

const App: React.FC = () => {
  // Presentational state, doesn't cross into wasm
  const [cellSize, setCellSize] = useState(5);
  const [colors, setColors] =
    useState(["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"]);
  const [running, setRunning] = useState(true);

  // State that is moved into wasm
  const [height, setHeight] = useState(128);
  const [width, setWidth] = useState(128);
  const [behaviors, setBehaviors] = useState("LLRR");

  return <>
    <ControlPanel running={running} setRunning={setRunning}/>
    <Canvas running={running}
            height={height}
            width={width}
            cellSize={cellSize}
            behaviors={behaviors}
            colors={colors}/>
  </>;
};

export default App;
