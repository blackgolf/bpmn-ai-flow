
import React, { useRef, useEffect, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BpmnViewerProps {
  bpmnXml: string | null;
}

const BpmnViewer: React.FC<BpmnViewerProps> = ({ bpmnXml }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const bpmnViewer = new BpmnJS({
      container: containerRef.current
    });

    setViewer(bpmnViewer);

    return () => {
      bpmnViewer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!viewer || !bpmnXml) return;

    try {
      viewer.importXML(bpmnXml)
        .then(() => {
          viewer.get('canvas').zoom('fit-viewport');
          toast.success('Diagrama BPMN carregado com sucesso');
        })
        .catch((err: Error) => {
          console.error('Erro ao importar diagrama BPMN:', err);
          toast.error('Erro ao carregar o diagrama BPMN');
        });
    } catch (error) {
      console.error('Erro ao processar diagrama BPMN:', error);
      toast.error('Erro ao processar o diagrama BPMN');
    }
  }, [viewer, bpmnXml]);

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
    <div className="w-full h-full flex flex-col">
      <div className="p-2 border-b flex gap-2">
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
      </div>
      <div ref={containerRef} className="w-full flex-grow" />
    </div>
  );
};

export default BpmnViewer;
