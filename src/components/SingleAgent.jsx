// src/components/CustomNode.jsx
import React from 'react';
import { Handle } from 'reactflow';
import './nodeStyles.css';

function SingleAgentNode({ data }) {
  return (
    <div className="single-agent-node node">
      <div>{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
}

export default SingleAgentNode;
