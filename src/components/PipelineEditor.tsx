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
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ElementPalette } from './ElementPalette';
import { PipelineToolbar } from './PipelineToolbar';
import { NodeConfigModal } from './NodeConfigModal';
import { CustomNode } from './CustomNode';
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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
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
    }
    setIsConfigModalOpen(false);
    setSelectedNode(null);
  }, [selectedNode, setNodes]);

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

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar Palette */}
      <div className="w-80 bg-card border-r border-border shadow-md">
        <ElementPalette />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <PipelineToolbar 
          onExport={exportWorkflow}
          onImport={importWorkflow}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />

        {/* React Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
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
            className="bg-gradient-surface"
          >
            <Controls className="!bg-card !border-border !shadow-md" />
            <MiniMap 
              className="!bg-card !border-border !shadow-md"
              nodeColor={(node) => {
                const type = node.data.nodeType;
                const colors = {
                  'data-source': '#3b82f6',
                  'transform': '#10b981',
                  'filter': '#f59e0b',
                  'aggregate': '#8b5cf6',
                  'output': '#ef4444'
                };
                return colors[type as keyof typeof colors] || '#6b7280';
              }}
            />
            <Background color="#e5e7eb" gap={20} />
          </ReactFlow>
        </div>
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

// Wrapper component with ReactFlowProvider
export const PipelineEditorWrapper = () => {
  return (
    <ReactFlowProvider>
      <PipelineEditor />
    </ReactFlowProvider>
  );
};