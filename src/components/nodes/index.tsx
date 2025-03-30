import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// Base node styling
const baseNodeStyle = (color: string, isDarkMode: boolean) => ({
  padding: '10px 15px',
  borderRadius: '5px',
  background: isDarkMode ? '#1F2937' : 'white',
  color: isDarkMode ? 'white' : '#1F2937',
  border: `2px solid ${color}`,
  width: 180,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
});

const headerStyle = (color: string) => ({
  background: color,
  color: color === '#F2C811' ? '#1F2937' : 'white',
  margin: '-10px -15px 10px -15px',
  padding: '8px 10px',
  borderTopLeftRadius: '3px',
  borderTopRightRadius: '3px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
});

const descriptionStyle = (isDarkMode: boolean) => ({
  fontSize: '12px',
  color: isDarkMode ? '#D1D5DB' : '#6B7280',
  marginTop: '5px',
});

// Database Node
export const DatabaseNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const isDarkMode = data.isDarkMode;
  
  return (
    <div style={baseNodeStyle(data.color, isDarkMode)}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div style={headerStyle(data.color)}>
        <i className="fas fa-database mr-2" />
        {data.label}
      </div>
      <div style={descriptionStyle(isDarkMode)}>{data.description}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};

// Service Node
export const ServiceNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const isDarkMode = data.isDarkMode;
  
  // Choose icon based on the type
  let icon = "fa-cogs";
  if (data.icon === "raspberry-pi") icon = "fab fa-raspberry-pi";
  if (data.icon === "microchip") icon = "fas fa-microchip";
  
  const iconClass = icon.startsWith("fab") ? "fab" : "fas";
  
  return (
    <div style={baseNodeStyle(data.color, isDarkMode)}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div style={headerStyle(data.color)}>
        <i className={`${iconClass} ${icon} mr-2`} />
        {data.label}
      </div>
      <div style={descriptionStyle(isDarkMode)}>{data.description}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
};

// External System Node
export const ExternalSystemNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const isDarkMode = data.isDarkMode;
  
  // Choose icon based on the type
  let icon = "fa-globe";
  if (data.icon === "google") icon = "fab fa-google";
  if (data.icon === "powerbi") icon = "fa-chart-bar";
  if (data.icon === "mobile") icon = "fa-mobile-alt";
  if (data.icon === "react") icon = "fab fa-react";
  
  const iconClass = icon.startsWith("fab") ? "fab" : "fas";
  
  return (
    <div style={baseNodeStyle(data.color, isDarkMode)}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div style={headerStyle(data.color)}>
        <i className={`${iconClass} ${icon} mr-2`} />
        {data.label}
      </div>
      <div style={descriptionStyle(isDarkMode)}>{data.description}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  );
}; 