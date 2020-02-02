import React from 'react';
import Canvas from './Canvas';
import './App.css';

const App: React.FC = () => {
  const height = 128;
  const width = 128;
  const cell_size = 5;
  const behaviors = "LRRRRLR";
  const colors = ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF"];

  return <>
    <Canvas height={height} width={width} cell_size={cell_size} behaviors={behaviors} colors={colors}/>
  </>;
};

export default App;
