import React, {useCallback, useState, useRef} from 'react';
import ReactFlow, {
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    Background,
    Connection,
    NodeChange,
    EdgeChange,
    XYPosition,
    NodeDragHandler,
    NodeTypes,
    BackgroundVariant,
    Panel,
    EdgeMouseHandler,
    ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';
import {nodeTypes} from './components/nodeTypes';

type CustomNodeData = {
    label: string;
    selectedRole?: string;
};

const initialNodes: Node<CustomNodeData>[] = [
    {
        id: '1',
        type: 'trigger',
        position: {x: 250, y: 5},
        data: {label: 'Trigger'},
    },
    {
        id: '2',
        type: 'capitalize',
        position: {x: 100, y: 100},
        data: {label: 'Capitalize Node'},
    },
    {
        id: '3',
        type: 'customNode',
        position: {x: 400, y: 200},
        data: {label: 'Custom Node'},
    },
];

const initialEdges: Edge[] = [
    {id: 'e1-2', source: '1', target: '2', animated: true},
    {id: 'e2-3', source: '2', target: '3'},
];

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const availableNodeTypes = Object.keys(nodeTypes);

    return (
        <aside style={{
            width: isOpen ? '200px' : '0',
            height: '100%',
            padding: isOpen ? '15px' : '0',
            borderRight: '1px solid #eee',
            backgroundColor: '#f8f8f8',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
        }}>
            {availableNodeTypes.map((nodeType) => (
                <div
                    key={nodeType}
                    className="dndnode"
                    onDragStart={(event) => onDragStart(event, nodeType)}
                    draggable
                    style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', cursor: 'grab' }}
                >
                    {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node
                </div>
            ))}
        </aside>
    );
};

const generateId = (() => {
    let counter = 1;
    return {
        next: () => `node_${counter++}`,
        setCounter: (value: number) => { counter = value; }
    };
})();

const App: React.FC = () => {
    const gridSize = 20;
    const [nodes, setNodes, onNodesChangeBase] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            onNodesChangeBase(changes);
            setNodes((nds) =>
                nds.map((node) => {
                    const change = changes.find((c) => {
                        return c.type === 'position' && 'id' in c && c.id === node.id;
                    });

                    if (change?.type === 'position' && 'position' in change && node.position) {
                        const x = Math.round(node.position.x / gridSize) * gridSize;
                        const y = Math.round(node.position.y / gridSize) * gridSize;
                        return {...node, position: {x, y}};
                    }
                    return node;
                })
            );
        },
        [onNodesChangeBase, gridSize]
    );

    const onNodeDragStop: NodeDragHandler = useCallback(
        (event, node) => {
            const x = Math.round(node.position.x / gridSize) * gridSize;
            const y = Math.round(node.position.y / gridSize) * gridSize;
            setNodes((nds) =>
                nds.map((n) => (n.id === node.id ? {...n, position: {x, y}} : n))
            );
        },
        [gridSize]
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const saveGraph = () => {
        const flow = {
            nodes,
            edges,
        };
        localStorage.setItem('savedFlow', JSON.stringify(flow));
    };

    const loadGraph = () => {
        const savedFlow = localStorage.getItem('savedFlow');
        if (savedFlow) {
            const {nodes: savedNodes, edges: savedEdges} = JSON.parse(savedFlow);
            
            if (savedNodes && savedNodes.length > 0) {
                const nodeIds = savedNodes
                    .map((node: Node<CustomNodeData>) => node.id)
                    .filter((id: string) => id.startsWith('node_'))
                    .map((id: string) => parseInt(id.replace('node_', ''), 10));
                
                const maxId = Math.max(...nodeIds, 0);
                generateId.setCounter(maxId + 1);
            }

            setNodes(savedNodes || []);
            setEdges(savedEdges || []);
        }
    };

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (!type || !reactFlowBounds || !reactFlowInstance) return;

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newPosition = {
                x: Math.round(position.x / gridSize) * gridSize,
                y: Math.round(position.y / gridSize) * gridSize,
            };

            const newNode: Node<CustomNodeData> = {
                id: generateId.next(),
                type,
                position: newPosition,
                data: { 
                    label: `${type} node`,
                    selectedRole: type === 'apiProcessor' ? '' : undefined 
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, gridSize]
    );

    const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
        setSelectedEdgeId(edge.id);
    }, []);

    const edgesWithSelection = edges.map(edge => ({
        ...edge,
        style: {
            stroke: edge.id === selectedEdgeId ? '#ff0072' : '#333333',
            strokeWidth: edge.id === selectedEdgeId ? 4 : 2,
        },
        animated: edge.animated,
    }));

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <div ref={reactFlowWrapper} style={{ flex: 1, height: '100%', position: 'relative' }}>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '10px',
                        zIndex: 10,
                        padding: '5px 10px',
                    }}
                >
                    {isSidebarOpen ? '←' : '→'}
                </button>
                <button
                    onClick={saveGraph}
                    style={{position: 'absolute', top: 40, zIndex: 10}}
                >
                    Save Graph
                </button>
                <button
                    onClick={loadGraph}
                    style={{position: 'absolute', top: 80, zIndex: 10}}
                >
                    Load Graph
                </button>
                <ReactFlow
                    nodes={nodes}
                    edges={edgesWithSelection}
                    onNodesChange={onNodesChange}
                    onNodeDragStop={onNodeDragStop}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes as NodeTypes}
                    snapToGrid={true}
                    snapGrid={[gridSize, gridSize]}
                    style={{ backgroundColor: '#C2C3C7' }}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onEdgeClick={onEdgeClick}
                    onPaneClick={() => setSelectedEdgeId(null)}
                    onInit={setReactFlowInstance}
                >
                    <Background variant={BackgroundVariant.Dots} gap={gridSize} size={1} color="#5F574F"/>
                    <Controls/>
                </ReactFlow>
            </div>
        </div>
    );
};

export default App;