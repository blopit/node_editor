import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const ApiProcessorNode = ({ data, isConnectable }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processData = useCallback(async (inputData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(data.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputData.text }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      
      // Pass the processed data to connected nodes
      const handle = document.querySelector('.api-processor-node .react-flow__handle-bottom');
      if (handle && handle._proxyOf) {
        handle._proxyOf.emit('processedData', { text: result.text });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data.apiEndpoint]);

  const handleInput = useCallback((e) => {
    if (e.data && e.data.text) {
      processData(e.data);
    }
  }, [processData]);

  useEffect(() => {
    const handle = document.querySelector('.api-processor-node .react-flow__handle-top');
    if (handle) {
      handle.addEventListener('textData', handleInput);
      handle.addEventListener('processedData', handleInput);
    }

    return () => {
      if (handle) {
        handle.removeEventListener('textData', handleInput);
        handle.removeEventListener('processedData', handleInput);
      }
    };
  }, [handleInput]);

  return (
    <div className="api-processor-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="api-processor-content">
        <strong>API Processor</strong>
        <div className="status">
          {loading && <p>Processing...</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ApiProcessorNode; 