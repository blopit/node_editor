// src/components/AddNode.jsx
import React from 'react';
import { Handle } from 'reactflow';
import './nodeStyles.css';

function AddNode({ data }) {
  return (
    <div className="add-node">
      <div>Add Node</div>
      <input
        type="number"
        onChange={(e) => (data.value = e.target.value)}
        placeholder="Value"
      />
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
}

export default AddNode;
