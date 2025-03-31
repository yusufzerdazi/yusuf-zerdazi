import { Position, MarkerType } from 'reactflow';

export const dreamsDiagramConfig = {
  nodes: [
    {
      id: 'website',
      type: 'external',
      data: { 
        label: 'Website',
        description: 'React-based web interface for dream analysis',
        icon: 'react',
        color: '#61DAFB'
      },
      position: { x: 50, y: 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    },
    {
      id: 'keep',
      type: 'external',
      data: { 
        label: 'Google Keep',
        description: 'I write my dreams as notes in Google Keep',
        icon: 'google',
        color: '#4285F4'
      },
      position: { x: 50, y: 150 },
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
    }
  ],
  edges: [
    {
      id: 'f-to-k',
      source: 'keep',
      target: 'function',
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
      id: 'website-to-function',
      source: 'website',
      target: 'function',
      label: 'HTTP',
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { stroke: '#888' }
    }
  ],
  title: "Dreams Analysis"
}; 