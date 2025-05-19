
import React, { useRef, useEffect, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { toast } from 'sonner';
import { bpmnStyles, applyCustomColors } from './BpmnStyles';

interface BpmnViewerCoreProps {
  bpmnXml: string | null;
  onViewerInit: (viewer: any) => void;
}

const BpmnViewerCore: React.FC<BpmnViewerCoreProps> = ({ bpmnXml, onViewerInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Adiciona o estilo CSS personalizado ao documento
    const newStyleElement = document.createElement('style');
    newStyleElement.textContent = bpmnStyles;
    document.head.appendChild(newStyleElement);
    setStyleElement(newStyleElement);

    const bpmnViewer = new BpmnJS({
      container: containerRef.current
    });

    onViewerInit(bpmnViewer);

    return () => {
      bpmnViewer.destroy();
      // Remove o estilo CSS personalizado quando o componente é desmontado
      if (newStyleElement && document.head.contains(newStyleElement)) {
        document.head.removeChild(newStyleElement);
      }
    };
  }, [onViewerInit]);

  useEffect(() => {
    if (!bpmnXml) return;

    const loadBpmnDiagram = async () => {
      const viewer = await import('bpmn-js').then(() => 
        (window as any).__bpmnJSInstance
      );
      
      if (!viewer) return;

      try {
        await viewer.importXML(bpmnXml);
        viewer.get('canvas').zoom('fit-viewport');
        
        applyCustomColors(viewer);
        toast.success('Diagrama BPMN carregado com sucesso');
      } catch (err) {
        console.error('Erro ao importar diagrama BPMN:', err);
        toast.error('Erro ao carregar o diagrama BPMN');
      }
    };

    loadBpmnDiagram().catch(error => {
      console.error('Erro ao processar diagrama BPMN:', error);
      toast.error('Erro ao processar o diagrama BPMN');
    });
  }, [bpmnXml]);

  return <div ref={containerRef} className="w-full flex-grow" />;
};

export default BpmnViewerCore;
