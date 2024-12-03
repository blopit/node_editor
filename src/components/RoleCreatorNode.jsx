import React, { useState, useEffect } from 'react';
import { 
  API_CONFIG,
  fetchAvailableTools,
  fetchAvailableModels,
  fetchAvailableAgentTypes
} from '../utils/handleUtils';
import './RoleCreatorNode.css';

const RoleCreatorNode = () => {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [agentType, setAgentType] = useState('');
  const [tools, setTools] = useState([]);
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.8);
  const [availableTools, setAvailableTools] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableAgentTypes, setAvailableAgentTypes] = useState([]);

  useEffect(() => {
    const fetchAvailableOptions = async () => {
      try {
        const [tools, models, agentTypes] = await Promise.all([
          fetchAvailableTools(),
          fetchAvailableModels(),
          fetchAvailableAgentTypes()
        ]);

        setAvailableTools(tools);
        setAvailableModels(models);
        setAvailableAgentTypes(agentTypes);
      } catch (error) {
        console.error('Error fetching available options:', error);
      }
    };

    fetchAvailableOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleData = {
      role_name: roleName,
      role_description: roleDescription,
      agent_type: agentType,
      tools,
      temperature,
      model,
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ROLES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create role');
      }

      alert('Role created successfully!');
      // Clear form
      setRoleName('');
      setRoleDescription('');
      setAgentType('');
      setTools([]);
      setModel('');
      setTemperature(0.8);
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role.');
    }
  };

  return (
    <div className="role-creator-node">
      <h3>Create Role</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role Name:</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Role Description:</label>
          <textarea
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            required
            className="form-textarea"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Agent Type:</label>
          <select
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select Agent Type</option>
            {availableAgentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tools:</label>
          <div className="tools-multiselect">
            {availableTools.map((tool) => (
              <label key={tool} className="tool-option">
                <input
                  type="checkbox"
                  value={tool}
                  checked={tools.includes(tool)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTools([...tools, tool]);
                    } else {
                      setTools(tools.filter(t => t !== tool));
                    }
                  }}
                />
                {tool}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select Model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>
            Temperature: {temperature}
          </label>
          <div className="temperature-slider">
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="form-slider"
            />
            <span className="temperature-value">{temperature}</span>
          </div>
        </div>
        <button type="submit" className="submit-button">Create Role</button>
      </form>
    </div>
  );
};

export default RoleCreatorNode; 