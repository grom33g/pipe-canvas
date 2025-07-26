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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-surface">
        <h2 className="text-xl font-semibold text-foreground mb-2">Pipeline Elements</h2>
        <p className="text-sm text-muted-foreground">
          Drag elements to the canvas to build your data pipeline
        </p>
      </div>

      {/* Element List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {paletteElements.map((element) => {
          const IconComponent = element.icon;
          
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(event) => onDragStart(event, element.type)}
              className={`
                p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing
                ${element.bgColor}
                hover:shadow-md transition-all duration-200
                hover:scale-[1.02] hover:-translate-y-0.5
                group
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-md bg-white shadow-sm
                  group-hover:shadow-md transition-shadow duration-200
                `}>
                  <IconComponent className={`w-5 h-5 ${element.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">
                    {element.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {element.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          <p className="mb-1">💡 <strong>Tips:</strong></p>
          <p>• Double-click nodes to configure</p>
          <p>• Connect nodes by dragging handles</p>
        </div>
      </div>
    </div>
  );
};