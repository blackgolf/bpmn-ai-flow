
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface BpmnZoomControlsProps {
  viewer: any;
}

const BpmnZoomControls: React.FC<BpmnZoomControlsProps> = ({ viewer }) => {
  const handleZoomIn = () => {
    if (!viewer) return;
    const canvas = viewer.get('canvas');
    const currentZoom = canvas.zoom();
    canvas.zoom(currentZoom + 0.1);
  };

  const handleZoomOut = () => {
    if (!viewer) return;
    const canvas = viewer.get('canvas');
    const currentZoom = canvas.zoom();
    canvas.zoom(currentZoom - 0.1);
  };

  const handleZoomFit = () => {
    if (!viewer) return;
    const canvas = viewer.get('canvas');
    canvas.zoom('fit-viewport');
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4 mr-1" />
        Ampliar
      </Button>
      <Button variant="outline" size="sm" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4 mr-1" />
        Reduzir
      </Button>
      <Button variant="outline" size="sm" onClick={handleZoomFit}>
        <Maximize2 className="h-4 w-4 mr-1" />
        Ajustar
      </Button>
    </>
  );
};

export default BpmnZoomControls;
