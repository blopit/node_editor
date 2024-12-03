import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { emitToHandle, DataTypes } from '../utils/handleUtils';

const TextInputNode = ({ id, isConnectable }) => {
  const [text, setText] = useState('');
  const { getEdges, getNode } = useReactFlow();

  const handleSubmit = useCallback(() => {
    console.log('Submitting text:', text);
    const edges = getEdges().filter(edge => edge.source === id);
    
    edges.forEach(edge => {
      const targetNode = getNode(edge.target);
      if (targetNode) {
        try {
          emitToHandle(targetNode.id, text, DataTypes.TEXT);
          console.log(`Emitted to ${targetNode.id}`);
        } catch (error) {
          console.error('Error emitting to handle:', error);
        }
      }
    });
  }, [text, id, getEdges, getNode]);

  return (
    <div className="text-input-node node">
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
        position={Position.Right}
        id="source"
        data-handleid="source"
        isConnectable={isConnectable}
        style={{ right: -8 }}
      />
    </div>
  );
};

export default TextInputNode; 