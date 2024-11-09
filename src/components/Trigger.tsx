// src/components/Trigger.tsx
import React, { useState } from 'react';
import BaseNode, { BaseNodeProps } from './BaseNode';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useReactFlow } from 'reactflow';
import { apiService } from '../api/ApiService';

const Trigger: React.FC<BaseNodeProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(props.data.value || '');
    const { setNodes } = useReactFlow();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const messages = [
                { role: 'user', content: inputValue }
            ];

            const response = await apiService.completions(
                'llama-3-8b-lexi-uncensored',
                messages
            );

            setNodes((nodes) => 
                nodes.map((node) => {
                    if (node.id === props.data.id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                response: response.choices[0].message.content
                            },
                        };
                    }
                    return node;
                })
            );

        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseNode {...props} className="trigger-node">
            <TextField
                label="Input"
                multiline
                rows={4}
                variant="outlined"
                size="small"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
        </BaseNode>
    );
}

export default Trigger;