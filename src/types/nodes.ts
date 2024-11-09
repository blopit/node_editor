import { NodeProps } from 'reactflow';

export interface NodeData {
    id: string;
    value?: string;
    response?: string;
    [key: string]: any;
}

// Create a custom node props interface without extending NodeProps
export interface BaseNodeProps {
    id: string;
    type: string;
    data: NodeData;
    selected: boolean;
    isConnectable?: boolean;
    xPos?: number;
    yPos?: number;
    dragHandle?: string;
    children?: React.ReactNode;
    className?: string;
    showInput?: boolean;
} 