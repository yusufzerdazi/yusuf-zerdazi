import { Position, MarkerType } from 'reactflow';

export const cameraDiagramConfig = {
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