// src/components/MultiplyNode.jsx
import React from 'react';
import {Handle} from 'reactflow';
import './nodeStyles.css';

function MultiplyNode({data}) {
    return (
        <div className="multiply-node">
            <div>Multiply Node</div>
            <input
                type="number"
                onChange={(e) => (data.value = e.target.value)}
                placeholder="Value"
            />
            <Handle type="target" position="left"/>
            <Handle type="source" position="right" id="a" style={{top: 10}}/>
            <Handle type="source" position="right" id="b" style={{bottom: 10, top: 'auto'}}/>
        </div>
    );
}

export default MultiplyNode;
