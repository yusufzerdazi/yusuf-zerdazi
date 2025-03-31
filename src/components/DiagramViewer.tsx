import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Node,
  Edge,
  NodeTypes,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useColorMode } from '../hooks/useColorMode';

// Custom node components
import { DatabaseNode, ServiceNode, ExternalSystemNode } from './nodes';

interface DiagramViewerProps {
  diagram: string;
  type?: 'architecture';
}

// Register custom node types
const nodeTypes: NodeTypes = {
  database: DatabaseNode,
  service: ServiceNode,
  external: ExternalSystemNode
};

const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagram }) => {
  const isDarkMode = useColorMode()[0] === 'dark';
  
  // Get the appropriate diagram configuration based on the diagram name
  const getDiagramConfig = () => {
    // Security Camera Architecture
    if (diagram === "camera") {
      return {
        nodes: [
          {
            id: 'pi',
            type: 'service',
            data: { 
              label: 'Raspberry Pi',
              description: 'Uses Motion to stream video and detect movement',
              icon: 'raspberry-pi',
              color: '#A22846'
            },
            position: { x: 300, y: 150 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'website',
            type: 'external',
            data: { 
              label: 'Website',
              description: 'React-based web interface',
              icon: 'react',
              color: '#61DAFB'
            },
            position: { x: 50, y: 50 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'ifttt',
            type: 'service',
            data: { 
              label: 'IFTTT',
              description: 'Webhook driven applet',
              icon: 'cogs',
              color: '#FF4400'
            },
            position: { x: 300, y: 300 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'mobile',
            type: 'external',
            data: { 
              label: 'Mobile',
              description: 'Receives push notifications',
              icon: 'mobile',
              color: '#4B5563'
            },
            position: { x: 550, y: 300 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'blob',
            type: 'database',
            data: { 
              label: 'Blob Storage',
              description: 'Stores motion detected videos',
              icon: 'database',
              color: '#008272'
            },
            position: { x: 550, y: 50 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          }
        ],
        edges: [
          {
            id: 'website-to-pi',
            source: 'website',
            target: 'pi',
            label: 'Embeds stream',
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          },
          {
            id: 'pi-to-ifttt',
            source: 'pi',
            target: 'ifttt',
            label: 'HTTP',
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          },
          {
            id: 'ifttt-to-mobile',
            source: 'ifttt',
            target: 'mobile',
            label: 'Push',
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          },
          {
            id: 'pi-to-blob',
            source: 'pi',
            target: 'blob',
            label: 'HTTP',
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          },
          {
            id: 'website-to-blob',
            source: 'website',
            target: 'blob',
            label: 'Reads from',
            type: 'smoothstep',
            sourceHandle: 'right-top',
            targetHandle: 'left-top',
            data: {
              routingOptions: {
                type: 'bezier',
                curvature: 0.5
              }
            },
            style: { stroke: '#888' }
          }
        ],
        title: "Security Camera"
      };
    } 
    
    // Cat Feeder Architecture
    else if (diagram === "feeder") {
      return {
        nodes: [
          {
            id: 'pi',
            type: 'service',
            data: { 
              label: 'Raspberry Pi',
              description: 'Camera set up to detect motion',
              icon: 'raspberry-pi',
              color: '#A22846'
            },
            position: { x: 300, y: 150 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'ml',
            type: 'service',
            data: { 
              label: 'Cognitive Services',
              description: 'Analyzes images to detect cats',
              icon: 'cogs',
              color: '#0072C6'
            },
            position: { x: 550, y: 150 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          },
          {
            id: 'arduino',
            type: 'service',
            data: { 
              label: 'Arduino',
              description: 'Controls servo motor that dispenses food',
              icon: 'microchip',
              color: '#00979D'
            },
            position: { x: 300, y: 300 },
            sourcePosition: Position.Right,
            targetPosition: Position.Left
          }
        ],
        edges: [
          {
            id: 'pi-to-ml',
            source: 'pi',
            target: 'ml',
            label: 'HTTP',
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          },
          {
            id: 'pi-to-arduino',
            source: 'pi',
            target: 'arduino',
            label: 'Bluetooth',
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: '#888' }
          }
        ],
        title: "Cat Feeder"
      };
    }
    
    // Dreams Architecture (default)
    return {
      nodes: [
        {
          id: 'keep',
          type: 'external',
          data: { 
            label: 'Google Keep',
            description: 'I write my dreams as notes in Google Keep',
            icon: 'google',
            color: '#4285F4'
          },
          position: { x: 50, y: 100 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        },
        {
          id: 'function',
          type: 'service',
          data: { 
            label: 'Azure Function',
            description: 'Polls Google Keep once a day for new dreams',
            icon: 'function',
            color: '#0078D4'
          },
          position: { x: 300, y: 100 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        },
        {
          id: 'ml',
          type: 'service',
          data: { 
            label: 'Cognitive Services',
            description: 'Analyzes the dreams using AI',
            icon: 'ai',
            color: '#0078D4'
          },
          position: { x: 300, y: 250 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        },
        {
          id: 'db',
          type: 'database',
          data: { 
            label: 'Blob Storage',
            description: 'Stores dreams and analysis results',
            icon: 'database',
            color: '#008272'
          },
          position: { x: 550, y: 100 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        },
        {
          id: 'bi',
          type: 'external',
          data: { 
            label: 'Power BI',
            description: 'Creates reports and visualizations',
            icon: 'powerbi',
            color: '#F2C811'
          },
          position: { x: 550, y: 250 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        }
      ],
      edges: [
        {
          id: 'f-to-k',
          source: 'function',
          target: 'keep',
          label: 'HTTP',
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#888' }
        },
        {
          id: 'f-to-db',
          source: 'function',
          target: 'db',
          label: 'HTTP',
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#888' }
        },
        {
          id: 'f-to-ml',
          source: 'function',
          target: 'ml',
          label: 'HTTP',
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#888' }
        },
        {
          id: 'bi-to-db',
          source: 'bi',
          target: 'db',
          label: 'Read',
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#888' }
        }
      ],
      title: "Dreams Analysis"
    };
  };
  
  // Get diagram configuration
  const diagramConfig = getDiagramConfig();
  
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