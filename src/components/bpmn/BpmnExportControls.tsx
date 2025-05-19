
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface BpmnExportControlsProps {
  viewer: any;
  bpmnXml: string | null;
}

const BpmnExportControls: React.FC<BpmnExportControlsProps> = ({ viewer, bpmnXml }) => {
  return (
    <Button variant="outline" size="sm" disabled>
      <Save className="h-4 w-4 mr-1" />
      Exportar
    </Button>
  );
};

export default BpmnExportControls;
