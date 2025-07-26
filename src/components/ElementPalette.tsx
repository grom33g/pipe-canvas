import React from 'react';
import { Database, Settings, Filter, BarChart3, Download } from 'lucide-react';

interface PaletteElement {
  type: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

const paletteElements: PaletteElement[] = [
  {
    type: 'data-source',
    label: 'Data Source',
    icon: Database,
    color: 'text-data-source',
    bgColor: 'bg-data-source-bg border-data-source/20',
    description: 'Input data from databases, APIs, or files'
  },
  {
    type: 'transform',
    label: 'Transform',
    icon: Settings,
    color: 'text-transform',
    bgColor: 'bg-transform-bg border-transform/20',
    description: 'Process and modify data records'
  },
  {
    type: 'filter',
    label: 'Filter',
    icon: Filter,
    color: 'text-filter',
    bgColor: 'bg-filter-bg border-filter/20',
    description: 'Filter data based on conditions'
  },
  {
    type: 'aggregate',
    label: 'Aggregate',
    icon: BarChart3,
    color: 'text-aggregate',
    bgColor: 'bg-aggregate-bg border-aggregate/20',
    description: 'Group and summarize data'
  },
  {
    type: 'output',
    label: 'Output',
    icon: Download,
    color: 'text-output',
    bgColor: 'bg-output-bg border-output/20',
    description: 'Export processed data'
  }
];

export const ElementPalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-surface">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary-glow/5 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground mb-1 gradient-text">Pipeline Elements</h2>
        <p className="text-xs text-muted-foreground">
          Drag elements to canvas
        </p>
      </div>

      {/* Element List */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {paletteElements.map((element, index) => {
          const IconComponent = element.icon;
          
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(event) => onDragStart(event, element.type)}
              className={`
                p-2 rounded-lg border cursor-grab active:cursor-grabbing
                ${element.bgColor}
                hover:shadow-md transition-all duration-200
                hover:scale-[1.01]
                group animate-fade-in glass backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-2">
                <div className={`
                  p-2 rounded-lg bg-white shadow-sm
                  group-hover:shadow-md transition-all duration-200
                  relative overflow-hidden
                `}>
                  <IconComponent className={`w-5 h-5 ${element.color} relative z-10`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {element.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {element.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground text-center">
          <p className="mb-1 font-medium">💡 Tips:</p>
          <div className="space-y-0.5 text-xs">
            <p>• Double-click to configure</p>
            <p>• Drag handles to connect</p>
            <p>• <kbd className="px-1 bg-muted rounded text-xs">Del</kbd> to remove</p>
          </div>
        </div>
      </div>
    </div>
  );
};