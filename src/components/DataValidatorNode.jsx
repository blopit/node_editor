import React, { useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const DataValidatorNode = ({ data, isConnectable }) => {
  const validateData = useCallback((inputData) => {
    const dataType = typeof inputData;
    let result = {
      isValid: false,
      type: dataType,
      message: ''
    };

    switch (data.expectedType) {
      case 'number':
        result.isValid = dataType === 'number' && !isNaN(inputData);
        result.message = result.isValid ? 'Valid number' : 'Invalid number';
        break;
      case 'string':
        result.isValid = dataType === 'string';
        result.message = result.isValid ? 'Valid text' : 'Invalid text';
        break;
      case 'boolean':
        result.isValid = dataType === 'boolean';
        result.message = result.isValid ? 'Valid boolean' : 'Invalid boolean';
        break;
      default:
        result.message = 'Unknown type';
    }

    return result;
  }, [data.expectedType]);

  const handleInput = useCallback((e) => {
    const inputData = e.data;
    const validationResult = validateData(inputData);
    
    // Pass the validation result to the next node
    if (e.target.hasOwnProperty('_proxyOf')) {
      e.target._proxyOf.emit('validateData', validationResult);
    }
  }, [validateData]);

  useEffect(() => {
    const handles = document.querySelectorAll('.react-flow__handle');
    handles.forEach(handle => {
      handle.addEventListener('input', handleInput);
    });

    return () => {
      handles.forEach(handle => {
        handle.removeEventListener('input', handleInput);
      });
    };
  }, [handleInput]);

  return (
    <div className="validator-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="validator-content">
        <strong>Data Validator</strong>
        <p>Expected Type: {data.expectedType}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default DataValidatorNode; 