import React, { useState } from 'react';
import BaseNode, { BaseNodeProps } from './BaseNode';
import Button from '@mui/material/Button';
import { useReactFlow } from 'reactflow';

const CapitalizeNode: React.FC<BaseNodeProps> = (props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { setNodes } = useReactFlow();

    const handleCapitalize = () => {
        try {
            setIsProcessing(true);
            const inputText = props.data.value || '';
            const capitalizedText = inputText.toUpperCase();
            
            setNodes((nodes) => 
                nodes.map((node) => {
                    if (node.id === props.data.id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                response: capitalizedText,
                            },
                        };
                    }
                    return node;
                })
            );
        } catch (error) {
            console.error('Error capitalizing text:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <BaseNode {...props} className="capitalize-node">
            <Button
                variant="contained"
                sx={{ mt: '20px' }}
                onClick={handleCapitalize}
                disabled={isProcessing}
            >
                Capitalize
            </Button>
        </BaseNode>
    );
}

export default CapitalizeNode; 