import { cameraDiagramConfig } from './camera';
import { feederDiagramConfig } from './feeder';
import { dreamsDiagramConfig } from './dreams';

export const diagramConfigs = {
  camera: cameraDiagramConfig,
  feeder: feederDiagramConfig,
  dreams: dreamsDiagramConfig
} as const;

export type DiagramType = keyof typeof diagramConfigs; 