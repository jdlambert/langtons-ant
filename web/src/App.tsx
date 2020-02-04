import React, { useState } from 'react';
import Canvas from './Canvas';
import ControlPanel from './ControlPanel';

import "./App.css";

const App: React.FC = () => {
  // Presentational state, doesn't cross into wasm
  const [cellSize, setCellSize] = useState(1);
  const [colors, setColors] =
    useState(["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"]);
  const [running, setRunning] = useState(true);

  // State that is moved into wasm
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [behaviors, setBehaviors] = useState("LLRR");

  return <div className="App">
    <ControlPanel running={running} 
                  setRunning={setRunning}
                  behaviors={behaviors}
                  setBehaviors={setBehaviors}/>
    <Canvas running={running}
            height={height}
            width={width}
            cellSize={cellSize}
            behaviors={behaviors}
            colors={colors}/>
  </div>;
};

export default App;
