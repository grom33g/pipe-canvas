import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react';

interface PipelineToolbarProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nodeCount: number;
  edgeCount: number;
}

export const PipelineToolbar: React.FC<PipelineToolbarProps> = ({
  onExport,
  onImport,
  nodeCount,
  edgeCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm">
      {/* Left section - Pipeline info */}
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Pipeline Editor
          </h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2" />
            {nodeCount} nodes
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2" />
            {edgeCount} connections
          </span>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-2">
        {/* File operations */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Pipeline controls */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          disabled
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          disabled
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Execution controls */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          disabled
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </Button>

        <Button
          size="sm"
          className="flex items-center space-x-2 bg-gradient-primary hover:opacity-90"
          disabled
        >
          <Save className="w-4 h-4" />
          <span>Save Pipeline</span>
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
      </div>
    </div>
  );
};