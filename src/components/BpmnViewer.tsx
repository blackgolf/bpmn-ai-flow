
import React, { useRef, useEffect, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
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

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default BpmnViewer;
