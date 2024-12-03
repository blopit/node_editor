import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { 
  useHandleData, 
  emitToHandle, 
  DataTypes, 
  fetchRoles,
  runAgent 
} from '../utils/handleUtils';

const ApiProcessorNode = ({ id, data, isConnectable }) => {
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

  // Listen for incoming text data
  const inputText = useHandleData(id, DataTypes.TEXT);

  // Add console log for incoming data
  useEffect(() => {
    if (inputText) {
      console.log(`Node ${id} received:`, {
        data: inputText,
        type: DataTypes.TEXT,
        timestamp: new Date().toISOString(),
        selectedRole: selectedRole
      });
    }
  }, [inputText, id, selectedRole]);

  const processData = React.useCallback(async (content) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Node ${id} processing:`, {
        input: content,
        role: selectedRole,
        timestamp: new Date().toISOString()
      });

      const result = await runAgent(selectedRole, content);
      
      if (!result) {
        throw new Error('Invalid response format');
      }

      console.log(`Node ${id} output:`, {
        result,
        timestamp: new Date().toISOString()
      });

      // Get all connected edges and emit to target nodes
      const edges = getEdges().filter(edge => edge.source === id);
      edges.forEach(edge => {
        console.log(`Node ${id} emitting to ${edge.target}:`, {
          data: result,
          timestamp: new Date().toISOString()
        });
        emitToHandle(edge.target, result, DataTypes.TEXT);
      });
    } catch (err) {
      console.error(`Node ${id} error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, getEdges, id]);

  // Process data whenever input text changes
  React.useEffect(() => {
    if (inputText) {
      processData(inputText);
    }
  }, [inputText, processData]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    // Update the node data when role changes
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
    <div className="api-processor-node node">
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        data-handleid="target"
        isConnectable={isConnectable}
        style={{ left: -8 }}
      />
      <div className="api-processor-content">
        <strong>AI Agent Processor</strong>
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
          {loading && <p className="loading">Processing...</p>}
          {error && <p className="error">{error}</p>}
        </div>
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

export default ApiProcessorNode; 