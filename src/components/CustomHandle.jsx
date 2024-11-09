// src/components/CustomHandle.jsx
import React from 'react';
import { Handle } from 'reactflow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CustomHandle({ type, position, icon, style, ...rest }) {
  return (
    <>
      <Handle
        type={type}
        position={position}
        style={{ visibility: 'hidden' }} // Hide the default handle
        {...rest}
      />
      <div
        style={{
          position: 'absolute',
          transform: `translate(${positionOffsets[position].x}px, ${positionOffsets[position].y}px)`,
          ...style,
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
    </>
  );
}

const positionOffsets = {
  left: { x: -20, y: -10 },
  right: { x: 10, y: -10 },
  top: { x: -10, y: -20 },
  bottom: { x: -10, y: 10 },
};

export default CustomHandle;
