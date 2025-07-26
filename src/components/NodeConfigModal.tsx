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
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Minus, 
  Eye, 
  Database, 
  Settings, 
  Filter, 
  BarChart3, 
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (config: any) => void;
}

interface ValidationError {
  field: string;
  message: string;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave
}) => {
  const [config, setConfig] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (node) {
      const nodeType = String(node.data.nodeType);
      setConfig(node.data.config || getDefaultConfig(nodeType));
      setValidationErrors([]);
    }
  }, [node]);

  const getDefaultConfig = (nodeType: string) => {
    const defaults = {
      'data-source': {
        connectionString: '',
        tableName: '',
        refreshInterval: 30,
        enableCache: true,
        connectionType: 'mysql'
      },
      'transform': {
        script: '',
        mappings: [{ source: '', target: '', transformation: 'direct' }],
        outputSchema: {},
        language: 'javascript'
      },
      'filter': {
        conditions: [{ field: '', operator: 'equals', value: '', logic: 'AND' }],
        enablePreview: true
      },
      'aggregate': {
        groupBy: [],
        aggregations: [{ field: '', function: 'sum', outputName: '' }],
        having: ''
      },
      'output': {
        destinationType: 'database',
        format: 'json',
        batchSize: 1000,
        compression: false,
        destination: ''
      }
    };
    return defaults[nodeType as keyof typeof defaults] || {};
  };

  const validateConfig = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const nodeType = node?.data.nodeType;

    switch (nodeType) {
      case 'data-source':
        if (!config.connectionString) errors.push({ field: 'connectionString', message: 'Connection string is required' });
        if (!config.tableName) errors.push({ field: 'tableName', message: 'Table name is required' });
        break;
      case 'transform':
        if (!config.script && config.mappings.length === 0) {
          errors.push({ field: 'script', message: 'Either script or mappings are required' });
        }
        break;
      case 'filter':
        if (config.conditions.some((c: any) => !c.field || !c.value)) {
          errors.push({ field: 'conditions', message: 'All filter conditions must have field and value' });
        }
        break;
      case 'aggregate':
        if (config.groupBy.length === 0) {
          errors.push({ field: 'groupBy', message: 'At least one group by field is required' });
        }
        if (config.aggregations.some((a: any) => !a.field || !a.outputName)) {
          errors.push({ field: 'aggregations', message: 'All aggregations must have field and output name' });
        }
        break;
      case 'output':
        if (!config.destination) errors.push({ field: 'destination', message: 'Destination is required' });
        break;
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateConfig();
    setValidationErrors(errors);

    if (errors.length === 0) {
      onSave(config);
      toast({
        title: "Configuration Saved",
        description: "Node configuration has been updated successfully.",
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before saving.",
        variant: "destructive",
      });
    }
  };

  const hasError = (field: string) => validationErrors.some(e => e.field === field);
  const getErrorMessage = (field: string) => validationErrors.find(e => e.field === field)?.message;

  const mockTableNames = ['users', 'orders', 'products', 'customers', 'transactions'];
  const mockFields = ['id', 'name', 'email', 'created_at', 'amount', 'status', 'category'];
  const mockPreviewData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', amount: 100 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 250 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', amount: 75 }
  ];

  const renderDataSourceConfig = () => (
    <Tabs defaultValue="connection" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="connection">Connection</TabsTrigger>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="connection" className="space-y-4">
        <div>
          <Label htmlFor="connection-type">Connection Type</Label>
          <Select
            value={config.connectionType || ''}
            onValueChange={(value) => setConfig({ ...config, connectionType: value })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select connection type" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
              <SelectItem value="mongodb">MongoDB</SelectItem>
              <SelectItem value="redis">Redis</SelectItem>
              <SelectItem value="api">REST API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="connection-string">Connection String</Label>
          <Input
            id="connection-string"
            value={config.connectionString || ''}
            onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
            placeholder="mysql://user:password@host:port/database"
            className={hasError('connectionString') ? 'border-destructive' : ''}
          />
          {hasError('connectionString') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getErrorMessage('connectionString')}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="table" className="space-y-4">
        <div>
          <Label htmlFor="table-name">Table/Collection Name</Label>
          <Select
            value={config.tableName || ''}
            onValueChange={(value) => setConfig({ ...config, tableName: value })}
          >
            <SelectTrigger className={`bg-background ${hasError('tableName') ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {mockTableNames.map(table => (
                <SelectItem key={table} value={table}>{table}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError('tableName') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getErrorMessage('tableName')}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label>Refresh Interval (seconds): {config.refreshInterval || 30}</Label>
          <Slider
            value={[config.refreshInterval || 30]}
            onValueChange={(value) => setConfig({ ...config, refreshInterval: value[0] })}
            max={300}
            min={5}
            step={5}
            className="mt-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={config.enableCache || false}
            onCheckedChange={(checked) => setConfig({ ...config, enableCache: checked })}
          />
          <Label>Enable caching</Label>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderTransformConfig = () => (
    <Tabs defaultValue="script" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="script">Script</TabsTrigger>
        <TabsTrigger value="mapping">Mapping</TabsTrigger>
        <TabsTrigger value="schema">Schema</TabsTrigger>
      </TabsList>

      <TabsContent value="script" className="space-y-4">
        <div>
          <Label htmlFor="language">Script Language</Label>
          <Select
            value={config.language || 'javascript'}
            onValueChange={(value) => setConfig({ ...config, language: value })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="script">Transformation Script</Label>
          <Textarea
            id="script"
            value={config.script || ''}
            onChange={(e) => setConfig({ ...config, script: e.target.value })}
            placeholder="// Transform your data here\nreturn data.map(row => ({\n  ...row,\n  processed: true\n}));"
            rows={8}
            className={`font-mono ${hasError('script') ? 'border-destructive' : ''}`}
          />
          {hasError('script') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getErrorMessage('script')}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="mapping" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Column Mappings</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfig({
              ...config,
              mappings: [...(config.mappings || []), { source: '', target: '', transformation: 'direct' }]
            })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Mapping
          </Button>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          {(config.mappings || []).map((mapping: any, index: number) => (
            <Card key={index} className="p-3">
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={mapping.source}
                  onValueChange={(value) => {
                    const newMappings = [...config.mappings];
                    newMappings[index] = { ...mapping, source: value };
                    setConfig({ ...config, mappings: newMappings });
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {mockFields.map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Target"
                  value={mapping.target}
                  onChange={(e) => {
                    const newMappings = [...config.mappings];
                    newMappings[index] = { ...mapping, target: e.target.value };
                    setConfig({ ...config, mappings: newMappings });
                  }}
                />

                <div className="flex space-x-1">
                  <Select
                    value={mapping.transformation}
                    onValueChange={(value) => {
                      const newMappings = [...config.mappings];
                      newMappings[index] = { ...mapping, transformation: value };
                      setConfig({ ...config, mappings: newMappings });
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="uppercase">Uppercase</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                      <SelectItem value="format_date">Format Date</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newMappings = config.mappings.filter((_: any, i: number) => i !== index);
                      setConfig({ ...config, mappings: newMappings });
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="schema" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Output Schema Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockFields.map(field => (
                <div key={field} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                  <span className="font-mono">{field}</span>
                  <Badge variant="secondary">string</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderFilterConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Filter Conditions</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfig({
            ...config,
            conditions: [...(config.conditions || []), { field: '', operator: 'equals', value: '', logic: 'AND' }]
          })}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Condition
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {(config.conditions || []).map((condition: any, index: number) => (
          <Card key={index} className="p-3">
            <div className="grid grid-cols-5 gap-2 items-end">
              {index > 0 && (
                <Select
                  value={condition.logic}
                  onValueChange={(value) => {
                    const newConditions = [...config.conditions];
                    newConditions[index] = { ...condition, logic: value };
                    setConfig({ ...config, conditions: newConditions });
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={condition.field}
                onValueChange={(value) => {
                  const newConditions = [...config.conditions];
                  newConditions[index] = { ...condition, field: value };
                  setConfig({ ...config, conditions: newConditions });
                }}
              >
                <SelectTrigger className={`bg-background ${index === 0 ? 'col-start-1' : ''}`}>
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {mockFields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={condition.operator}
                onValueChange={(value) => {
                  const newConditions = [...config.conditions];
                  newConditions[index] = { ...condition, operator: value };
                  setConfig({ ...config, conditions: newConditions });
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater">Greater Than</SelectItem>
                  <SelectItem value="less">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="starts_with">Starts With</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                value={condition.value}
                onChange={(e) => {
                  const newConditions = [...config.conditions];
                  newConditions[index] = { ...condition, value: e.target.value };
                  setConfig({ ...config, conditions: newConditions });
                }}
              />

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newConditions = config.conditions.filter((_: any, i: number) => i !== index);
                  setConfig({ ...config, conditions: newConditions });
                }}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {hasError('conditions') && (
        <p className="text-sm text-destructive flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {getErrorMessage('conditions')}
        </p>
      )}

      {config.enablePreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Preview Filtered Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockPreviewData.slice(0, 2).map((row, index) => (
                <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                  {JSON.stringify(row, null, 2)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAggregateConfig = () => (
    <Tabs defaultValue="grouping" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="grouping">Grouping</TabsTrigger>
        <TabsTrigger value="aggregations">Aggregations</TabsTrigger>
      </TabsList>

      <TabsContent value="grouping" className="space-y-4">
        <div>
          <Label>Group By Fields</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {mockFields.map(field => (
              <div key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(config.groupBy || []).includes(field)}
                  onChange={(e) => {
                    const newGroupBy = e.target.checked
                      ? [...(config.groupBy || []), field]
                      : (config.groupBy || []).filter((f: string) => f !== field);
                    setConfig({ ...config, groupBy: newGroupBy });
                  }}
                  className="rounded"
                />
                <Label className="text-sm">{field}</Label>
              </div>
            ))}
          </div>
          {hasError('groupBy') && (
            <p className="text-sm text-destructive mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getErrorMessage('groupBy')}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="having">Having Clause (Optional)</Label>
          <Input
            id="having"
            value={config.having || ''}
            onChange={(e) => setConfig({ ...config, having: e.target.value })}
            placeholder="COUNT(*) > 5"
          />
        </div>
      </TabsContent>

      <TabsContent value="aggregations" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Aggregation Functions</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfig({
              ...config,
              aggregations: [...(config.aggregations || []), { field: '', function: 'sum', outputName: '' }]
            })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Aggregation
          </Button>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          {(config.aggregations || []).map((agg: any, index: number) => (
            <Card key={index} className="p-3">
              <div className="grid grid-cols-4 gap-2">
                <Select
                  value={agg.field}
                  onValueChange={(value) => {
                    const newAggs = [...config.aggregations];
                    newAggs[index] = { ...agg, field: value };
                    setConfig({ ...config, aggregations: newAggs });
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {mockFields.map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={agg.function}
                  onValueChange={(value) => {
                    const newAggs = [...config.aggregations];
                    newAggs[index] = { ...agg, function: value };
                    setConfig({ ...config, aggregations: newAggs });
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="sum">SUM</SelectItem>
                    <SelectItem value="count">COUNT</SelectItem>
                    <SelectItem value="avg">AVERAGE</SelectItem>
                    <SelectItem value="min">MIN</SelectItem>
                    <SelectItem value="max">MAX</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Output Name"
                  value={agg.outputName}
                  onChange={(e) => {
                    const newAggs = [...config.aggregations];
                    newAggs[index] = { ...agg, outputName: e.target.value };
                    setConfig({ ...config, aggregations: newAggs });
                  }}
                />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newAggs = config.aggregations.filter((_: any, i: number) => i !== index);
                    setConfig({ ...config, aggregations: newAggs });
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {hasError('aggregations') && (
          <p className="text-sm text-destructive flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {getErrorMessage('aggregations')}
          </p>
        )}
      </TabsContent>
    </Tabs>
  );

  const renderOutputConfig = () => (
    <Tabs defaultValue="destination" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="destination">Destination</TabsTrigger>
        <TabsTrigger value="format">Format</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="destination" className="space-y-4">
        <div>
          <Label htmlFor="destination-type">Destination Type</Label>
          <Select
            value={config.destinationType || ''}
            onValueChange={(value) => setConfig({ ...config, destinationType: value })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="file">File System</SelectItem>
              <SelectItem value="s3">Amazon S3</SelectItem>
              <SelectItem value="api">REST API</SelectItem>
              <SelectItem value="kafka">Kafka Topic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="destination">Destination Path/URL</Label>
          <Input
            id="destination"
            value={config.destination || ''}
            onChange={(e) => setConfig({ ...config, destination: e.target.value })}
            placeholder="/path/to/output or https://api.example.com/data"
            className={hasError('destination') ? 'border-destructive' : ''}
          />
          {hasError('destination') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getErrorMessage('destination')}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="format" className="space-y-4">
        <div>
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={config.format || 'json'}
            onValueChange={(value) => setConfig({ ...config, format: value })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="parquet">Parquet</SelectItem>
              <SelectItem value="avro">Avro</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={config.compression || false}
            onCheckedChange={(checked) => setConfig({ ...config, compression: checked })}
          />
          <Label>Enable compression</Label>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label>Batch Size: {config.batchSize || 1000}</Label>
          <Slider
            value={[config.batchSize || 1000]}
            onValueChange={(value) => setConfig({ ...config, batchSize: value[0] })}
            max={10000}
            min={100}
            step={100}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="headers">Custom Headers (JSON)</Label>
          <Textarea
            id="headers"
            value={config.headers || ''}
            onChange={(e) => setConfig({ ...config, headers: e.target.value })}
            placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
            rows={3}
            className="font-mono"
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderConfigContent = () => {
    if (!node) return null;

    const nodeType = node.data.nodeType;
    const icons = {
      'data-source': Database,
      'transform': Settings,
      'filter': Filter,
      'aggregate': BarChart3,
      'output': Download
    };

    const IconComponent = icons[nodeType as keyof typeof icons];

    switch (nodeType) {
      case 'data-source':
        return renderDataSourceConfig();
      case 'transform':
        return renderTransformConfig();
      case 'filter':
        return renderFilterConfig();
      case 'aggregate':
        return renderAggregateConfig();
      case 'output':
        return renderOutputConfig();
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {node && (() => {
              const nodeType = node.data.nodeType;
              const icons = {
                'data-source': Database,
                'transform': Settings,
                'filter': Filter,
                'aggregate': BarChart3,
                'output': Download
              };
              const IconComponent = icons[nodeType as keyof typeof icons];
              return <IconComponent className="w-5 h-5" />;
            })()}
            <span>Configure {String(node?.data.label || 'Node')}</span>
            {validationErrors.length === 0 && Object.keys(config).length > 0 && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="py-4">
          {renderConfigContent()}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            {validationErrors.length > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{validationErrors.length} error{validationErrors.length > 1 ? 's' : ''}</span>
              </Badge>
            )}
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};