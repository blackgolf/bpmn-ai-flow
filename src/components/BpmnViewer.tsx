
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

  // Estilo personalizado para aplicar as cores BPMN
  const bpmnStyles = `
    .djs-container .bpmn-icon-start-event-none circle {
      fill: #B7F774 !important;
      stroke: #2ECC40 !important;
    }
    .djs-container .bpmn-icon-intermediate-event-none circle {
      fill: #FFE599 !important;
      stroke: #B7B700 !important;
    }
    .djs-container .bpmn-icon-end-event-none circle {
      fill: #FFB3B3 !important;
      stroke: #FF0000 !important;
    }
    .djs-container .bpmn-element-task rect {
      fill: #FFFFFF !important;
      stroke: #000000 !important;
    }
    .djs-container .bpmn-icon-gateway-xor polygon {
      fill: #FFFFFF !important;
      stroke: #000000 !important;
    }
    
    /* Cores para elementos específicos */
    .djs-container .djs-visual[data-element-id*="StartEvent"] circle {
      fill: #B7F774 !important;
      stroke: #2ECC40 !important;
    }
    .djs-container .djs-visual[data-element-id*="EndEvent"] circle {
      fill: #FFB3B3 !important;
      stroke: #FF0000 !important;
    }
    .djs-container .djs-visual[data-element-id*="Task"] rect {
      fill: #FFFFFF !important;
      stroke: #000000 !important;
    }
    .djs-container .djs-visual[data-element-id*="Gateway"] polygon {
      fill: #FFFFFF !important;
      stroke: #000000 !important;
    }
  `;

  useEffect(() => {
    if (!containerRef.current) return;

    // Adiciona o estilo CSS personalizado ao documento
    const styleElement = document.createElement('style');
    styleElement.textContent = bpmnStyles;
    document.head.appendChild(styleElement);

    const bpmnViewer = new BpmnJS({
      container: containerRef.current
    });

    setViewer(bpmnViewer);

    return () => {
      bpmnViewer.destroy();
      // Remove o estilo CSS personalizado quando o componente é desmontado
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (!viewer || !bpmnXml) return;

    try {
      viewer.importXML(bpmnXml)
        .then(() => {
          viewer.get('canvas').zoom('fit-viewport');
          
          // Aplicar cores personalizadas após a importação
          const elementRegistry = viewer.get('elementRegistry');
          const graphicsFactory = viewer.get('graphicsFactory');
          
          elementRegistry.forEach((element: any) => {
            if (element.type === 'bpmn:StartEvent') {
              element.businessObject.di.set('fill', '#B7F774');
              element.businessObject.di.set('stroke', '#2ECC40');
              graphicsFactory.update('shape', element, element.gfx);
            } 
            else if (element.type === 'bpmn:EndEvent') {
              element.businessObject.di.set('fill', '#FFB3B3');
              element.businessObject.di.set('stroke', '#FF0000');
              graphicsFactory.update('shape', element, element.gfx);
            }
            else if (element.type === 'bpmn:Task' || element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask') {
              element.businessObject.di.set('fill', '#FFFFFF');
              element.businessObject.di.set('stroke', '#000000');
              graphicsFactory.update('shape', element, element.gfx);
            }
            else if (element.type.includes('Gateway')) {
              element.businessObject.di.set('fill', '#FFFFFF');
              element.businessObject.di.set('stroke', '#000000');
              graphicsFactory.update('shape', element, element.gfx);
            }
          });

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
