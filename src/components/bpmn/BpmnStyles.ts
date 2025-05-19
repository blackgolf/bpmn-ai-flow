
/**
 * Styles for the BPMN diagram elements
 */
export const bpmnStyles = `
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

export const applyCustomColors = (viewer: any) => {
  if (!viewer) return;
  
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
};
