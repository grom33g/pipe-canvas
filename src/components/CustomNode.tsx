import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Settings, Filter, BarChart3, Download, MoreHorizontal } from 'lucide-react';

const nodeIcons = {
  'data-source': Database,
  'transform': Settings,
  'filter': Filter,
  'aggregate': BarChart3,
  'output': Download,
};

const nodeColors = {
  'data-source': {
    color: 'text-data-source',
    bg: 'bg-data-source-bg',
    border: 'border-data-source/30',
    accent: 'bg-data-source'
  },
  'transform': {
    color: 'text-transform',
    bg: 'bg-transform-bg',
    border: 'border-transform/30',
    accent: 'bg-transform'
  },
  'filter': {
    color: 'text-filter',
    bg: 'bg-filter-bg',
    border: 'border-filter/30',
    accent: 'bg-filter'
  },
  'aggregate': {
    color: 'text-aggregate',
    bg: 'bg-aggregate-bg',
    border: 'border-aggregate/30',
    accent: 'bg-aggregate'
  },
  'output': {
    color: 'text-output',
    bg: 'bg-output-bg',
    border: 'border-output/30',
    accent: 'bg-output'
  },
};

export const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeType = data.nodeType as keyof typeof nodeIcons;
  const IconComponent = nodeIcons[nodeType] || Settings;
  const colors = nodeColors[nodeType] || nodeColors.transform;

  const isInputNode = nodeType === 'data-source';
  const isOutputNode = nodeType === 'output';

  return (
    <div className={`
      relative bg-gradient-node rounded-xl border-2 transition-all duration-300 node-enter
      ${selected ? 'border-primary shadow-glow scale-105' : `${colors.border} hover:border-primary/50 hover:shadow-lg`}
      group min-w-[180px] hover-scale backdrop-blur-sm
    `}>
      {/* Accent bar with gradient */}
      <div className={`h-1 ${colors.accent} rounded-t-[10px] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      
      {/* Node content */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`
            p-2 rounded-lg ${colors.bg} border ${colors.border}
            transition-all duration-200 group-hover:scale-110 group-hover:shadow-md
          `}>
            <IconComponent className={`w-5 h-5 ${colors.color} transition-transform duration-200 group-hover:rotate-12`} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-sm">
              {String(data.label)}
            </h3>
            <p className="text-xs text-muted-foreground">
              ID: {String(data.nodeType)}
            </p>
          </div>

          <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-muted rounded hover-scale">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Configuration preview with animation */}
        {data.config && Object.keys(data.config).length > 0 && (
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground animate-fade-in">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Configured</span>
            </div>
          </div>
        )}
      </div>

      {/* Connection handles with enhanced styling */}
      {!isInputNode && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gradient-primary !border-2 !border-white hover:!scale-125 transition-all duration-200 !shadow-md"
        />
      )}
      
      {!isOutputNode && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gradient-primary !border-2 !border-white hover:!scale-125 transition-all duration-200 !shadow-md"
        />
      )}
    </div>
  );
};