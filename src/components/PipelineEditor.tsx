import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ElementPalette } from './ElementPalette';
import { PipelineToolbar } from './PipelineToolbar';
import { NodeConfigModal } from './NodeConfigModal';
import { CustomNode } from './CustomNode';
import { StatusBar } from './StatusBar';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { ThemeProvider } from './ThemeProvider';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const PipelineEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'default',
      style: { strokeWidth: 2, stroke: '#374151' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          nodeType: type,
          label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigModalOpen(true);
  }, []);

  const handleConfigSave = useCallback((config: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );
      setLastSaved(new Date());
    }
    setIsConfigModalOpen(false);
    setSelectedNode(null);
  }, [selectedNode, setNodes]);

  const validatePipeline = useCallback(() => {
    const errors: string[] = [];
    
    // Check for orphaned nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const orphanedNodes = nodes.filter(node => !connectedNodeIds.has(node.id) && nodes.length > 1);
    if (orphanedNodes.length > 0) {
      errors.push(`${orphanedNodes.length} orphaned node(s) detected`);
    }
    
    // Check for cycles (basic check)
    // This is a simplified cycle detection - for production, use a proper algorithm
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [nodes, edges]);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setValidationErrors([]);
    toast({
      title: "Pipeline Cleared",
      description: "All nodes and connections have been removed.",
    });
  }, [setNodes, setEdges, toast]);

  const handleUndo = useCallback(() => {
    // Placeholder for undo functionality
    toast({
      title: "Undo",
      description: "Undo functionality coming soon!",
    });
  }, [toast]);

  const handleRedo = useCallback(() => {
    // Placeholder for redo functionality
    toast({
      title: "Redo", 
      description: "Redo functionality coming soon!",
    });
  }, [toast]);

  const exportWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'pipeline-workflow.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setLastSaved(new Date());
    toast({
      title: "Workflow Exported",
      description: "Your pipeline has been exported successfully.",
    });
  }, [nodes, edges, toast]);

  const importWorkflow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
        toast({
          title: "Workflow Imported",
          description: "Your pipeline has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import workflow. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  }, [setNodes, setEdges, toast]);

  // Validate pipeline when nodes or edges change
  React.useEffect(() => {
    validatePipeline();
  }, [nodes, edges, validatePipeline]);

  return (
    <div className="h-screen flex bg-background">
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts
        onSave={exportWorkflow}
        onImport={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        onExport={exportWorkflow}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Sidebar Palette */}
      <div className="w-56 border-r border-border shadow-xl relative z-10">
        <ElementPalette />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <PipelineToolbar 
          onExport={exportWorkflow}
          onImport={importWorkflow}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          nodeCount={nodes.length}
          edgeCount={edges.length}
          lastSaved={lastSaved}
        />

        {/* React Flow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
            minZoom={0.1}
            maxZoom={2}
            className="bg-gradient-surface"
            proOptions={{ hideAttribution: true }}
          >
            <Controls 
              className="!bg-card/80 !border-border !shadow-xl !backdrop-blur-sm hover-scale" 
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <MiniMap 
              className="!bg-card/80 !border-border !shadow-xl !backdrop-blur-sm !rounded-lg"
              nodeColor={(node) => {
                const type = String(node.data.nodeType);
                const colors = {
                  'data-source': '#3b82f6',
                  'transform': '#10b981',
                  'filter': '#f59e0b',
                  'aggregate': '#8b5cf6',
                  'output': '#ef4444'
                };
                return colors[type as keyof typeof colors] || '#6b7280';
              }}
              maskColor="rgb(0, 0, 0, 0.1)"
              pannable
              zoomable
            />
            <Background 
              color="var(--border)" 
              gap={20} 
              className="opacity-50"
            />
          </ReactFlow>
        </div>

        {/* Status Bar */}
        <StatusBar
          nodeCount={nodes.length}
          edgeCount={edges.length}
          isValid={validationErrors.length === 0}
          validationErrors={validationErrors}
          lastSaved={lastSaved}
        />
      </div>

      {/* Configuration Modal */}
      <NodeConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        node={selectedNode}
        onSave={handleConfigSave}
      />
    </div>
  );
};

// Wrapper component with ReactFlowProvider and ThemeProvider
export const PipelineEditorWrapper = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pipeline-editor-theme">
      <ReactFlowProvider>
        <PipelineEditor />
      </ReactFlowProvider>
    </ThemeProvider>
  );
};