import React from 'react';
import { Handle, Position } from 'reactflow';
import { useHandleData, DataTypes } from '../utils/handleUtils';

const TextDisplayNode = ({ id, isConnectable }) => {
  const displayText = useHandleData(id, DataTypes.TEXT);

  return (
    <div className="text-display-node">
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        data-handleid="target"
        isConnectable={isConnectable}
      />
      <div className="text-display-content">
        <strong>Text Display</strong>
        <div className="display-area">
          {displayText || 'Waiting for input...'}
        </div>
      </div>
    </div>
  );
};

export default TextDisplayNode; 