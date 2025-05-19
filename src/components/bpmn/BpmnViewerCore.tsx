
import React, { useRef, useEffect, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { toast } from 'sonner';
import { bpmnStyles } from './BpmnStyles';

interface BpmnViewerCoreProps {
  bpmnXml: string | null;
  onViewerInit: (viewer: any) => void;
}

const BpmnViewerCore: React.FC<BpmnViewerCoreProps> = ({ bpmnXml, onViewerInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);

  // Initialize the viewer only once
  useEffect(() => {
    if (!containerRef.current) return;

    // Add custom CSS style to the document
    const newStyleElement = document.createElement('style');
    newStyleElement.textContent = bpmnStyles;
    document.head.appendChild(newStyleElement);
    setStyleElement(newStyleElement);

    const bpmnViewer = new BpmnJS({
      container: containerRef.current
    });
    
    viewerRef.current = bpmnViewer;
    onViewerInit(bpmnViewer);
    
    return () => {
      bpmnViewer.destroy();
      // Remove the custom CSS style when component is unmounted
      if (newStyleElement && document.head.contains(newStyleElement)) {
        document.head.removeChild(newStyleElement);
      }
    };
  }, []); // Only run once on mount

  // Handle XML changes in a separate effect
  useEffect(() => {
    if (!bpmnXml || !viewerRef.current) return;

    const loadBpmnDiagram = async () => {
      const viewer = viewerRef.current;
      
      try {
        // Clear previous diagram first
        viewer.clear();
        
        // Import the new XML
        await viewer.importXML(bpmnXml);
        viewer.get('canvas').zoom('fit-viewport');
        
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
  }, [bpmnXml]); // Only run when bpmnXml changes

  return <div ref={containerRef} className="w-full flex-grow" />;
};

export default BpmnViewerCore;
