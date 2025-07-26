import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Activity,
  Database
} from 'lucide-react';

interface StatusBarProps {
  nodeCount: number;
  edgeCount: number;
  isValid: boolean;
  validationErrors: string[];
  lastSaved?: Date;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  nodeCount,
  edgeCount,
  isValid,
  validationErrors,
  lastSaved
}) => {
  const getValidationStatus = () => {
    if (validationErrors.length === 0 && nodeCount > 0) {
      return {
        icon: CheckCircle,
        text: 'Valid Pipeline',
        variant: 'default' as const,
        color: 'text-green-500'
      };
    } else if (validationErrors.length > 0) {
      return {
        icon: AlertCircle,
        text: `${validationErrors.length} Error${validationErrors.length > 1 ? 's' : ''}`,
        variant: 'destructive' as const,
        color: 'text-destructive'
      };
    } else {
      return {
        icon: Clock,
        text: 'Empty Pipeline',
        variant: 'secondary' as const,
        color: 'text-muted-foreground'
      };
    }
  };

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="h-10 px-4 py-2 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left side - Pipeline stats */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3" />
            <span>{nodeCount} nodes</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>{edgeCount} connections</span>
          </div>

          {lastSaved && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Center - Performance indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>Real-time</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Right side - Validation status */}
        <div className="flex items-center space-x-2">
          <Badge 
            variant={status.variant}
            className="text-xs flex items-center space-x-1 animate-scale-in"
          >
            <StatusIcon className={`w-3 h-3 ${status.color}`} />
            <span>{status.text}</span>
          </Badge>

          {/* Keyboard shortcuts hint */}
          <div className="hidden md:flex items-center space-x-1 text-xs text-muted-foreground">
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd>
            <span>Save</span>
          </div>
        </div>
      </div>
    </Card>
  );
};