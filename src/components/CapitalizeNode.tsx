import React, { useState } from 'react';
import BaseNode, { BaseNodeProps } from './BaseNode';
import Button from '@mui/material/Button';
import {Handle, Position, useReactFlow} from 'reactflow';

const DEFAULT_HANDLE_STYLE = {
    width: 10,
    height: 10,
    bottom: -5,
};

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
            <Handle
                type="source"
                id="red"
                position={Position.Bottom}
                style={{ ...DEFAULT_HANDLE_STYLE, left: '15%', background: 'red' }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="blue"
                style={{ ...DEFAULT_HANDLE_STYLE, left: '50%', background: 'blue' }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="orange"
                style={{ ...DEFAULT_HANDLE_STYLE, left: '85%', background: 'orange' }}
            />
        </BaseNode>
    );
}

export default CapitalizeNode; 