// src/components/CustomNode.jsx
import React from 'react';
import { Handle } from 'reactflow';
import TextField from '@mui/material/TextField';

function CustomNode({ data }) {
  return (
    <div className="custom-node node">
      <div>{data.label}</div>
      <TextField
        label="Your Text"
        multiline
        rows={4}
        variant="outlined"
        size="small"
        fullWidth
        onChange={(e) => (data.value = e.target.value)}
      />
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
}

export default CustomNode;
