import React from 'react';
import TreeCanvas from './components/TreeCanvas';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Decision Tree Solver</h1>
      <TreeCanvas />
    </div>
  );
}

export default App;
