import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (config: any) => void;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave
}) => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (node) {
      setConfig(node.data.config || {});
    }
  }, [node]);

  const handleSave = () => {
    onSave(config);
  };

  const renderConfigFields = () => {
    if (!node) return null;

    const nodeType = node.data.nodeType;

    switch (nodeType) {
      case 'data-source':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="source-type">Source Type</Label>
              <Select
                value={config.sourceType || ''}
                onValueChange={(value) => setConfig({ ...config, sourceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="stream">Data Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="connection-string">Connection String</Label>
              <Input
                id="connection-string"
                value={config.connectionString || ''}
                onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
                placeholder="Enter connection details"
              />
            </div>

            <div>
              <Label htmlFor="query">Query/Path</Label>
              <Textarea
                id="query"
                value={config.query || ''}
                onChange={(e) => setConfig({ ...config, query: e.target.value })}
                placeholder="SQL query or file path"
                rows={3}
              />
            </div>
          </div>
        );

      case 'transform':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="transform-type">Transform Type</Label>
              <Select
                value={config.transformType || ''}
                onValueChange={(value) => setConfig({ ...config, transformType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transformation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="map">Map Fields</SelectItem>
                  <SelectItem value="calculate">Calculate</SelectItem>
                  <SelectItem value="convert">Convert Types</SelectItem>
                  <SelectItem value="split">Split Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expression">Expression</Label>
              <Textarea
                id="expression"
                value={config.expression || ''}
                onChange={(e) => setConfig({ ...config, expression: e.target.value })}
                placeholder="Transformation expression or mapping"
                rows={4}
              />
            </div>
          </div>
        );

      case 'filter':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="filter-field">Field</Label>
              <Input
                id="filter-field"
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
                placeholder="Field name to filter"
              />
            </div>

            <div>
              <Label htmlFor="filter-operator">Operator</Label>
              <Select
                value={config.operator || ''}
                onValueChange={(value) => setConfig({ ...config, operator: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not-equals">Not Equals</SelectItem>
                  <SelectItem value="greater">Greater Than</SelectItem>
                  <SelectItem value="less">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-value">Value</Label>
              <Input
                id="filter-value"
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                placeholder="Filter value"
              />
            </div>
          </div>
        );

      case 'aggregate':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="group-by">Group By</Label>
              <Input
                id="group-by"
                value={config.groupBy || ''}
                onChange={(e) => setConfig({ ...config, groupBy: e.target.value })}
                placeholder="Comma-separated field names"
              />
            </div>

            <div>
              <Label htmlFor="aggregations">Aggregations</Label>
              <Textarea
                id="aggregations"
                value={config.aggregations || ''}
                onChange={(e) => setConfig({ ...config, aggregations: e.target.value })}
                placeholder="SUM(field1), COUNT(*), AVG(field2)"
                rows={3}
              />
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="output-type">Output Type</Label>
              <Select
                value={config.outputType || ''}
                onValueChange={(value) => setConfig({ ...config, outputType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="file">File Export</SelectItem>
                  <SelectItem value="api">API Endpoint</SelectItem>
                  <SelectItem value="stream">Data Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={config.destination || ''}
                onChange={(e) => setConfig({ ...config, destination: e.target.value })}
                placeholder="Output destination"
              />
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select
                value={config.format || ''}
                onValueChange={(value) => setConfig({ ...config, format: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="parquet">Parquet</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            <p>No configuration options available for this node type.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Configure {String(node?.data.label || 'Node')}</span>
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="py-4">
          {renderConfigFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};