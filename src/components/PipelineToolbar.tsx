import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Pause,
  RotateCcw,
  Zap,
  Undo,
  Redo,
  Settings,
  HelpCircle,
  Maximize
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PipelineToolbarProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  nodeCount: number;
  edgeCount: number;
  lastSaved?: Date;
}

export const PipelineToolbar: React.FC<PipelineToolbarProps> = ({
  onExport,
  onImport,
  onClear,
  onUndo,
  onRedo,
  nodeCount,
  edgeCount,
  lastSaved
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <TooltipProvider>
      <div className="h-16 bg-gradient-surface border-b border-border px-6 flex items-center justify-between shadow-lg backdrop-blur-sm">
        {/* Left section - Pipeline info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground gradient-text">
                Pipeline Editor
              </h1>
              <p className="text-xs text-muted-foreground">
                Visual data workflow builder
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1 hover-scale">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium">{nodeCount}</span>
              <span>nodes</span>
            </div>
            <div className="flex items-center space-x-1 hover-scale">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{edgeCount}</span>
              <span>connections</span>
            </div>
            {lastSaved && (
              <div className="flex items-center space-x-1 text-xs">
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2">
          {/* File operations */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportClick}
                  className="hover-scale transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import Pipeline (Ctrl+O)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="hover-scale transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Pipeline (Ctrl+E)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Edit operations */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  className="hover-scale transition-all duration-200"
                  disabled={!onUndo}
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  className="hover-scale transition-all duration-200"
                  disabled={!onRedo}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="hover-scale transition-all duration-200 hover:border-destructive"
                  disabled={!onClear}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Pipeline</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Pipeline controls */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-scale transition-all duration-200"
                  disabled
                >
                  <Play className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run Pipeline (Coming Soon)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-scale transition-all duration-200"
                  disabled
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pipeline Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Theme and help */}
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-scale transition-all duration-200"
                  disabled
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Primary action */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-primary hover:opacity-90 transition-all duration-200 hover-scale shadow-lg"
                disabled
              >
                <Save className="w-4 h-4 mr-2" />
                <span>Save Pipeline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Pipeline (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>

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
    </TooltipProvider>
  );
};