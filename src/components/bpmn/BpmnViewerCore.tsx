
import React, { useRef, useEffect, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { toast } from 'sonner';
import { bpmnStyles, applyCustomColors, applyColorsOnImport } from './BpmnStyles';

interface BpmnViewerCoreProps {
  bpmnXml: string | null;
  onViewerInit: (viewer: any) => void;
}

const BpmnViewerCore: React.FC<BpmnViewerCoreProps> = ({ bpmnXml, onViewerInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null);
  const [currentXml, setCurrentXml] = useState<string | null>(null);

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
    
    // Initialize event listeners for applying colors
    applyColorsOnImport(bpmnViewer);
    
    // Pass the viewer instance to the parent component
    onViewerInit(bpmnViewer);
    
    return () => {
      if (bpmnViewer) {
        try {
          bpmnViewer.destroy();
        } catch (err) {
          console.error('Error destroying BPMN viewer:', err);
        }
      }
      
      // Remove the custom CSS style when component is unmounted
      if (newStyleElement && document.head.contains(newStyleElement)) {
        document.head.removeChild(newStyleElement);
      }
    };
  }, []); // Only run once on mount

  // Handle XML changes in a separate effect
  useEffect(() => {
    // Check if XML has changed to avoid unnecessary reloads
    if (!bpmnXml || bpmnXml === currentXml || !viewerRef.current) return;
    
    setCurrentXml(bpmnXml);
    
    const loadBpmnDiagram = async () => {
      const viewer = viewerRef.current;
      
      try {
        // Clear previous diagram first
        await viewer.clear();
        
        // Import the new XML
        const result = await viewer.importXML(bpmnXml);
        
        if (result.warnings && result.warnings.length > 0) {
          console.warn('BPMN import warnings:', result.warnings);
        }
        
        // Use direct styling for elements instead of businessObject.di
        const elementRegistry = viewer.get('elementRegistry');
        const canvas = viewer.get('canvas');
        
        elementRegistry.forEach((element: any) => {
          if (element.type === 'bpmn:StartEvent' && element.di) {
            element.di.set('fill', '#B7F774');
            element.di.set('stroke', '#2ECC40');
          } 
          else if (element.type === 'bpmn:EndEvent' && element.di) {
            element.di.set('fill', '#FFB3B3');
            element.di.set('stroke', '#FF0000');
          }
        });
        
        // Adjust viewport
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
