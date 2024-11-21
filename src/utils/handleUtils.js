import React, { useState, useEffect, useRef } from 'react';

// Supported data types for validation
export const DataTypes = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ANY: 'any'
};

// Helper function to emit data to connected nodes
export const emitToHandle = (targetNodeId, data, dataType = DataTypes.ANY) => {
  const handle = document.querySelector(`[data-id="${targetNodeId}-target-target"]`);
  
  if (handle) {
    // Validate data type before sending
    if (!validateDataType(data, dataType)) {
      console.warn(`Invalid data type. Expected ${dataType}`);
      return false;
    }

    const event = new CustomEvent('handleUpdate', {
      detail: { data, dataType },
      bubbles: true
    });
    handle.dispatchEvent(event);
    return true;
  }
  return false;
};

// Helper function to validate data types
export const validateDataType = (data, expectedType) => {
  switch (expectedType) {
    case DataTypes.TEXT:
      return typeof data === 'string';
    case DataTypes.NUMBER:
      return typeof data === 'number' && !isNaN(data);
    case DataTypes.BOOLEAN:
      return typeof data === 'boolean';
    case DataTypes.JSON:
      return typeof data === 'object';
    case DataTypes.ANY:
      return true;
    default:
      return false;
  }
};

// Custom hook for handle data reception
export const useHandleData = (id, expectedType = DataTypes.ANY) => {
  const [data, setData] = React.useState(null);
  const handleRef = React.useRef(null);

  React.useEffect(() => {
    const handle = document.querySelector(`[data-id="${id}-target-target"]`);
    handleRef.current = handle;

    const handleUpdate = (event) => {
      const { data, dataType } = event.detail;
      
      if (expectedType !== DataTypes.ANY && dataType !== expectedType) {
        console.warn(`Type mismatch: Expected ${expectedType}, got ${dataType}`);
        return;
      }
      
      setData(data);
    };

    if (handle) {
      handle.addEventListener('handleUpdate', handleUpdate);
    }

    return () => {
      if (handleRef.current) {
        handleRef.current.removeEventListener('handleUpdate', handleUpdate);
      }
    };
  }, [id, expectedType]);

  return data;
}; 