import React from 'react';
import Canvas from './Canvas';
import './App.css';

const App: React.FC = () => {
  const height = 128;
  const width = 128;
  const cell_size = 5;

  return <>
    <Canvas height={height} width={width} cell_size={cell_size}/>
  </>;
};

export default App;
