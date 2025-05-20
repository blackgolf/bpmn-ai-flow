
import React, { useState } from 'react';
import BpmnViewerCore from './bpmn/BpmnViewerCore';
import BpmnZoomControls from './bpmn/BpmnZoomControls';
import BpmnExportControls from './bpmn/BpmnExportControls';

interface BpmnViewerProps {
  bpmnXml: string | null;
}

const BpmnViewer: React.FC<BpmnViewerProps> = ({ bpmnXml }) => {
  const [viewer, setViewer] = useState<any>(null);

  const handleViewerInit = (newViewer: any) => {
    setViewer(newViewer);
    (window as any).__bpmnJSInstance = newViewer;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-2 border-b flex flex-wrap gap-2">
        <BpmnZoomControls viewer={viewer} />
        <BpmnExportControls viewer={viewer} bpmnXml={bpmnXml} />
      </div>
      <BpmnViewerCore bpmnXml={bpmnXml} onViewerInit={handleViewerInit} />
    </div>
  );
};

export default BpmnViewer;
