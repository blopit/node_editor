import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { emitToHandle, DataTypes } from '../utils/handleUtils';

const TextInputNode = ({ id, isConnectable }) => {
  const [text, setText] = useState('');
  const { getEdges, getNode } = useReactFlow();

  const handleSubmit = useCallback(() => {
    const edges = getEdges().filter(edge => edge.source === id);
    
    edges.forEach(edge => {
      const targetNode = getNode(edge.target);
      if (targetNode) {
        emitToHandle(targetNode.id, text, DataTypes.TEXT);
      }
    });
  }, [text, id, getEdges, getNode]);

  return (
    <div className="text-input-node">
      <div className="text-input-content">
        <strong>Text Input</strong>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows={4}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default TextInputNode; 