import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { useHandleData, emitToHandle, DataTypes, runAgent } from '../utils/handleUtils';

const TriagerNode = ({ id, isConnectable }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getEdges, getNode } = useReactFlow();

  const inputText = useHandleData(id, DataTypes.TEXT);

  useEffect(() => {
    if (inputText) {
      console.log(`TriagerNode ${id} received:`, inputText);
      setText(inputText);
    }
  }, [inputText, id]);

  const determineBestRole = useCallback(async (content) => {
    setLoading(true);
    setError(null);

    try {
      const edges = getEdges().filter(edge => edge.source === id);
      let bestRole = null;
      let bestScore = -Infinity;

      for (const edge of edges) {
        const targetNode = getNode(edge.target);
        if (targetNode && targetNode.data.selectedRole) {
          const role = targetNode.data.selectedRole;
          const score = await runAgent(role, content, true); // Assume runAgent can return a suitability score
          if (score > bestScore) {
            bestScore = score;
            bestRole = role;
          }
        }
      }

      if (bestRole) {
        console.log(`Best role determined: ${bestRole}`);
        emitToHandle(bestRole, content, DataTypes.TEXT);
      } else {
        throw new Error('No suitable role found');
      }
    } catch (err) {
      console.error(`TriagerNode ${id} error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getEdges, getNode, id]);

  useEffect(() => {
    if (text) {
      determineBestRole(text);
    }
  }, [text, determineBestRole]);

  return (
    <div className="triager-node node">
      <div className="triager-content">
        <strong>Triager Node</strong>
        {loading && <p className="loading">Determining best role...</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        data-handleid="target"
        isConnectable={isConnectable}
        style={{ left: -8 }}
      />
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

export default TriagerNode;
