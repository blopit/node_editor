// src/services/api.ts
import axios from 'axios';

// Define base URL as a constant
const API_BASE_URL = 'http://localhost:8000';

// Define interfaces for your data types
export interface Item {
    id?: number;
    name: string;
    description: string;
}

export interface Agent {
    id: string;
    role_name: string;
    role_description: string[];
    agent_type: string; // AgentType enum
    tools: string[]; // ToolList array 
    temperature: number;
    model: string; // ModelType enum
}

// Define a class for the API service
export class ApiService {
    private static instance: ApiService;
    private baseURL: string;

    private constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Singleton pattern to ensure only one instance exists
    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    // Get all DYLAN models
    async getDylanModels(): Promise<string> {
        try {
            const response = await axios.get<{
                data: { id: string; object: string; owned_by: string }[]
            }>(`http://67.163.11.58:1234/v1/models`);

            // Extracting and joining all the 'id' fields from the 'data' array
            if (response.data && response.data.data) {
                const modelIds = response.data.data.map(model => model.id).join(', ');
                return modelIds;
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    async completions(model: string, message: { role: string; content: string }[]): Promise<any> {
        try {
            const response = await axios.post(`http://67.163.11.58:1234/v1/chat/completions`, {
                model: model,
                messages: message
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error making completion request:', error);
            throw error;
        }
    }

    // Get all items
    async getItems(): Promise<Item[]> {
        try {
            const response = await axios.get<Item[]>(`${this.baseURL}/items`);
            return response.data;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    // Get single item by ID
    async getItem(id: number): Promise<Item> {
        try {
            const response = await axios.get<Item>(`${this.baseURL}/items/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching item ${id}:`, error);
            throw error;
        }
    }

    // Create new item
    async createItem(item: Omit<Item, 'id'>): Promise<Item> {
        try {
            const response = await axios.post<Item>(`${this.baseURL}/items`, item);
            return response.data;
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    // Update existing item
    async updateItem(id: number, item: Partial<Item>): Promise<Item> {
        try {
            const response = await axios.put<Item>(`${this.baseURL}/items/${id}`, item);
            return response.data;
        } catch (error) {
            console.error(`Error updating item ${id}:`, error);
            throw error;
        }
    }

    // Delete item
    async deleteItem(id: number): Promise<void> {
        try {
            await axios.delete(`${this.baseURL}/items/${id}`);
        } catch (error) {
            console.error(`Error deleting item ${id}:`, error);
            throw error;
        }
    }

    async createAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
        try {
            const response = await axios.post<Agent>(`${this.baseURL}/agents`, agent);
            return response.data;
        } catch (error) {
            console.error('Error creating agent:', error);
            throw error;
        }
    }

    async getAgents(): Promise<Agent[]> {
        try {
            const response = await axios.get<Agent[]>(`${this.baseURL}/agents`);
            return response.data;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    }

    async getAgent(id: string): Promise<Agent> {
        try {
            const response = await axios.get<Agent>(`${this.baseURL}/agents/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching agent ${id}:`, error);
            throw error;
        }
    }

    async updateAgent(id: string, agent: Partial<Agent>): Promise<Agent> {
        try {
            const response = await axios.put<Agent>(`${this.baseURL}/agents/${id}`, agent);
            return response.data;
        } catch (error) {
            console.error(`Error updating agent ${id}:`, error);
            throw error;
        }
    }   

    async deleteAgent(id: string): Promise<void> {
        try {
            await axios.delete(`${this.baseURL}/agents/${id}`);
        } catch (error) {
            console.error(`Error deleting agent ${id}:`, error);
            throw error;
        }
    }
}

// Export a default instance
export const apiService = ApiService.getInstance();