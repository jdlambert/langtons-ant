import React, { useState } from 'react';
import Canvas from './Canvas';
import './App.css';
import ControlPanel from './ControlPanel';

const App: React.FC = () => {
  const [height, setHeight] = useState(128);
  const [width, setWidth] = useState(128);
  const [cellSize, setCellSize] = useState(5);
  const [behaviors, setBehaviors] = useState("LRRRRLR");
  const [colors, setColors] =
    useState(["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF"]);

  return <>
    <ControlPanel />
    <Canvas height={height} width={width} cellSize={cellSize} behaviors={behaviors} colors={colors}/>
  </>;
};

export default App;
