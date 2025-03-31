import { Position, MarkerType } from 'reactflow';

export const feederDiagramConfig = {
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