import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { 
  useHandleData, 
  emitToHandle, 
  DataTypes, 
  fetchRoles,
  runAgent 
} from '../utils/handleUtils';

const TriagerNode = ({ id, data, isConnectable }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const { getEdges, getNode, setNodes } = useReactFlow();
  
  // Use the saved role from node data, or default to empty string
  const selectedRole = data.selectedRole || '';

  // Fetch available roles on component mount
  useEffect(() => {
    const loadRoles = async () => {
      const availableRoles = await fetchRoles();
      setRoles(availableRoles);
      if (availableRoles.length > 0 && !selectedRole) {
        // Set the first role as default if none is selected
        setNodes(nodes => nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                selectedRole: availableRoles[0].name
              }
            };
          }
          return node;
        }));
      }
    };
    loadRoles();
  }, [id, selectedRole, setNodes]);

  const inputText = useHandleData(id, DataTypes.TEXT);

  useEffect(() => {
    if (inputText) {
      console.log(`TriagerNode ${id} received:`, {
        data: inputText,
        type: DataTypes.TEXT,
        timestamp: new Date().toISOString(),
        selectedRole: selectedRole
      });
    }
  }, [inputText, id, selectedRole]);

  const determineBestRole = useCallback(async (content) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`TriagerNode ${id} processing:`, {
        input: content,
        role: selectedRole,
        timestamp: new Date().toISOString()
      });

      const edges = getEdges().filter(edge => edge.source === id);
      let bestRole = null;
      let bestScore = -Infinity;

      for (const edge of edges) {
        const targetNode = getNode(edge.target);
        if (targetNode && targetNode.data.selectedRole) {
          const role = targetNode.data.selectedRole;
          const score = await runAgent(selectedRole, `Given this text: "${content}", rate from 0-100 how suitable the role "${role}" would be to process it.`, false);
          const numericalScore = parseInt(score) || 0;
          
          console.log(`Score for role ${role}:`, numericalScore);
          
          if (numericalScore > bestScore) {
            bestScore = numericalScore;
            bestRole = edge.target;
          }
        }
      }

      if (bestRole) {
        console.log(`TriagerNode ${id} selected target:`, bestRole);
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
  }, [getEdges, getNode, id, selectedRole]);

  useEffect(() => {
    if (inputText) {
      determineBestRole(inputText);
    }
  }, [inputText, determineBestRole]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setNodes(nodes => nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            selectedRole: newRole
          }
        };
      }
      return node;
    }));
  };

  return (
    <div className="triager-node node">
      <div className="triager-content">
        <strong>Triager Node</strong>
        <div className="role-selector">
          <select 
            value={selectedRole}
            onChange={handleRoleChange}
          >
            {roles.map(role => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="status">
          {loading && <p className="loading">Determining best role...</p>}
          {error && <p className="error">{error}</p>}
        </div>
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
