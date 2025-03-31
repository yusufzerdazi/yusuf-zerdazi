import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Node,
  Edge,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useColorMode } from '../hooks/useColorMode';
import { diagramConfigs, DiagramType } from '../config/diagrams';

// Custom node components
import { DatabaseNode, ServiceNode, ExternalSystemNode } from './nodes';

interface DiagramViewerProps {
  diagram: DiagramType;
}

// Register custom node types
const nodeTypes: NodeTypes = {
  database: DatabaseNode,
  service: ServiceNode,
  external: ExternalSystemNode
};

const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagram }) => {
  const isDarkMode = useColorMode()[0] === 'dark';
  
  // Get diagram configuration
  const diagramConfig = diagramConfigs[diagram];
  
  // Define the initial nodes with industry-standard shapes
  const initialNodes: Node[] = diagramConfig.nodes;

  // Define edges with proper routing and markers
  const initialEdges: Edge[] = diagramConfig.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update theme when dark mode changes
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isDarkMode
        }
      }))
    );
    
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: isDarkMode ? '#9CA3AF' : '#6B7280'
        },
        labelStyle: {
          fill: isDarkMode ? '#E5E7EB' : '#4B5563',
          fontWeight: 500
        }
      }))
    );
  }, [isDarkMode, setNodes, setEdges]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
        Architecture
      </h3>
      <div 
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" 
        style={{ height: 400 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={2}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
        >
          <Background color={isDarkMode ? '#4B5563' : '#E5E7EB'} gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default DiagramViewer; 