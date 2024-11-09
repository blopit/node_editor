import React from 'react';
import { Handle, Position } from 'reactflow';
import './nodeStyles.css';

export interface BaseNodeProps {
    data: {
        id: string;
        value?: string;
        response?: string;
    };
    selected?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const BaseNode: React.FC<BaseNodeProps> = ({ data, selected, children, className = '' }) => {
    return (
        <div className={`node-wrapper ${selected ? 'selected' : ''}`}>
            <div className={`node base-node ${className}`}>
                <Handle type="target" position={Position.Left} />
                {children}
                <Handle type="source" position={Position.Right} />
            </div>
            {data.response && (
                <div className="node-response">
                    <pre>{data.response}</pre>
                </div>
            )}
        </div>
    );
}

export default BaseNode; 