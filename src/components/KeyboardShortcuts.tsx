import React, { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

interface KeyboardShortcutsProps {
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onSave,
  onImport,
  onExport,
  onClear,
  onUndo,
  onRedo
}) => {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
  const { toast } = useToast();

  const deleteSelected = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const remainingNodes = nodes.filter(node => !node.selected);
      const remainingEdges = edges.filter(edge => !edge.selected);
      
      setNodes(remainingNodes);
      setEdges(remainingEdges);
      
      toast({
        title: "Elements Deleted",
        description: `Removed ${selectedNodes.length} nodes and ${selectedEdges.length} connections`,
      });
    }
  }, [getNodes, getEdges, setNodes, setEdges, toast]);

  const selectAll = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    setNodes(nodes.map(node => ({ ...node, selected: true })));
    setEdges(edges.map(edge => ({ ...edge, selected: true })));
    
    toast({
      title: "All Selected",
      description: `Selected ${nodes.length} nodes and ${edges.length} connections`,
    });
  }, [getNodes, getEdges, setNodes, setEdges, toast]);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrlKey: true,
      action: onSave,
      description: 'Save Pipeline'
    },
    {
      key: 'o',
      ctrlKey: true,
      action: onImport,
      description: 'Open Pipeline'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: onExport,
      description: 'Export Pipeline'
    },
    {
      key: 'Delete',
      action: deleteSelected,
      description: 'Delete Selected'
    },
    {
      key: 'Backspace',
      action: deleteSelected,
      description: 'Delete Selected'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: selectAll,
      description: 'Select All'
    },
    {
      key: 'z',
      ctrlKey: true,
      action: onUndo,
      description: 'Undo'
    },
    {
      key: 'y',
      ctrlKey: true,
      action: onRedo,
      description: 'Redo'
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: onRedo,
      description: 'Redo'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.shiftKey === event.shiftKey &&
      !!s.altKey === event.altKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null; // This component doesn't render anything
};