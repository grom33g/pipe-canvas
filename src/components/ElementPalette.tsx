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
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary-glow/5 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-foreground mb-2 gradient-text">Pipeline Elements</h2>
        <p className="text-sm text-muted-foreground">
          Drag elements to the canvas to build your data pipeline
        </p>
      </div>

      {/* Element List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {paletteElements.map((element, index) => {
          const IconComponent = element.icon;
          
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(event) => onDragStart(event, element.type)}
              className={`
                p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing
                ${element.bgColor}
                hover:shadow-lg transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-1
                group animate-fade-in glass backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-3 rounded-xl bg-white shadow-lg
                  group-hover:shadow-xl transition-all duration-300
                  group-hover:scale-110 group-hover:rotate-6
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
                  <IconComponent className={`w-6 h-6 ${element.color} relative z-10`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                    {element.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">
                    {element.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground text-center">
          <p className="mb-2 font-medium">💡 <strong>Pro Tips:</strong></p>
          <div className="space-y-1">
            <p>• Double-click nodes to configure settings</p>
            <p>• Connect nodes by dragging handles</p>
            <p>• Use <kbd className="px-1 bg-muted rounded">Del</kbd> to remove selected items</p>
          </div>
        </div>
      </div>
    </div>
  );
};