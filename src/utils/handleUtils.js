import React, { useState, useEffect, useRef } from 'react';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    AGENTS_RUN: '/agents/run',
    ROLES: '/roles/',
    TOOLS_AVAILABLE: '/roles/tools/available',
    MODELS_AVAILABLE: '/roles/models/available',
    AGENT_TYPES_AVAILABLE: '/roles/agent-types/available'
  }
};

// Supported data types for validation
export const DataTypes = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ANY: 'any'
};

// Helper function to fetch available roles
export const fetchRoles = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ROLES}`);
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    const roles = await response.json();
    return roles.map(role => ({
      name: role.role_name,
      description: role.role_description,
      agentType: role.agent_type,
      tools: role.tools,
      temperature: role.temperature,
      model: role.model,
      id: role.id
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

// Helper function to run agent
export const runAgent = async (roleName, content) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AGENTS_RUN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role_name: roleName,
        content: content
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();
    return result.response?.msgs?.[0]?.content || null;
  } catch (error) {
    console.error('Error running agent:', error);
    throw error;
  }
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

// Helper function to fetch available tools
export const fetchAvailableTools = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOOLS_AVAILABLE}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available tools');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available tools:', error);
    return [];
  }
};

// Helper function to fetch available models
export const fetchAvailableModels = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODELS_AVAILABLE}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available models:', error);
    return [];
  }
};

// Helper function to fetch available agent types
export const fetchAvailableAgentTypes = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AGENT_TYPES_AVAILABLE}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available agent types');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available agent types:', error);
    return [];
  }
}; 