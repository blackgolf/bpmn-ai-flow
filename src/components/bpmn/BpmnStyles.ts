
/**
 * Styles for the BPMN diagram elements
 */
export const bpmnStyles = `
  /* Base styles for common event types */
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
  
  /* More specific selectors for elements by their type or ID pattern */
  .djs-container .djs-visual[data-element-id*="StartEvent"] circle {
    fill: #B7F774 !important;
    stroke: #2ECC40 !important;
    stroke-width: 2px !important;
  }
  .djs-container .djs-visual[data-element-id*="EndEvent"] circle {
    fill: #FFB3B3 !important;
    stroke: #FF0000 !important;
    stroke-width: 2px !important;
  }
  .djs-container .djs-visual[data-element-id*="Task"] rect {
    fill: #FFFFFF !important;
    stroke: #000000 !important;
  }
  .djs-container .djs-visual[data-element-id*="Gateway"] polygon {
    fill: #FFFFFF !important;
    stroke: #000000 !important;
  }
  
  /* Additional selectors targeting element types directly */
  .djs-container [data-element-type="bpmn:StartEvent"] circle {
    fill: #B7F774 !important;
    stroke: #2ECC40 !important;
    stroke-width: 2px !important;
  }
  .djs-container [data-element-type="bpmn:EndEvent"] circle {
    fill: #FFB3B3 !important;
    stroke: #FF0000 !important;
    stroke-width: 2px !important;
  }
  
  /* Target all SVG circles inside start events */
  .djs-container .djs-element.djs-shape[data-shape-type="bpmn:StartEvent"] .djs-visual circle {
    fill: #B7F774 !important;
    stroke: #2ECC40 !important;
    stroke-width: 2px !important;
  }
  
  /* Target all SVG circles inside end events */
  .djs-container .djs-element.djs-shape[data-shape-type="bpmn:EndEvent"] .djs-visual circle {
    fill: #FFB3B3 !important;
    stroke: #FF0000 !important;
    stroke-width: 2px !important;
  }
`;

export const applyCustomColors = (viewer: any) => {
  if (!viewer) return;
  
  const elementRegistry = viewer.get('elementRegistry');
  const graphicsFactory = viewer.get('graphicsFactory');
  const canvas = viewer.get('canvas');
  
  // Apply custom colors to all elements based on their type
  elementRegistry.forEach((element: any) => {
    // Verificar se o element possui a propriedade businessObject.di antes de acessá-la
    if (element.type === 'bpmn:StartEvent' && element.businessObject && element.di) {
      element.di.set('fill', '#B7F774');
      element.di.set('stroke', '#2ECC40');
      graphicsFactory.update('shape', element, element.gfx);
    } 
    else if (element.type === 'bpmn:EndEvent' && element.businessObject && element.di) {
      element.di.set('fill', '#FFB3B3');
      element.di.set('stroke', '#FF0000');
      graphicsFactory.update('shape', element, element.gfx);
    }
    else if ((element.type === 'bpmn:Task' || element.type === 'bpmn:UserTask' || 
              element.type === 'bpmn:ServiceTask') && element.businessObject && element.di) {
      element.di.set('fill', '#FFFFFF');
      element.di.set('stroke', '#000000');
      graphicsFactory.update('shape', element, element.gfx);
    }
    else if (element.type.includes('Gateway') && element.businessObject && element.di) {
      element.di.set('fill', '#FFFFFF');
      element.di.set('stroke', '#000000');
      graphicsFactory.update('shape', element, element.gfx);
    }
  });
  
  // Force redraw to apply the styles
  canvas.zoom('fit-viewport');
};

/**
 * Apply colors when diagram is imported
 */
export const applyColorsOnImport = (viewer: any) => {
  if (!viewer) return;
  
  // Apply colors when diagram elements are added
  const eventBus = viewer.get('eventBus');
  
  eventBus.on('shape.added', (event: any) => {
    const element = event.element;
    
    if (element.type === 'bpmn:StartEvent' && element.di) {
      element.di.set('fill', '#B7F774');
      element.di.set('stroke', '#2ECC40');
    } 
    else if (element.type === 'bpmn:EndEvent' && element.di) {
      element.di.set('fill', '#FFB3B3');
      element.di.set('stroke', '#FF0000');
    }
  });
  
  // Also apply colors when elements are rendered
  eventBus.on('render.shape', (event: any) => {
    const element = event.element;
    const gfx = event.gfx;
    
    if (element.type === 'bpmn:StartEvent') {
      const circle = gfx.querySelector('circle');
      if (circle) {
        circle.style.fill = '#B7F774';
        circle.style.stroke = '#2ECC40';
      }
    } 
    else if (element.type === 'bpmn:EndEvent') {
      const circle = gfx.querySelector('circle');
      if (circle) {
        circle.style.fill = '#FFB3B3';
        circle.style.stroke = '#FF0000';
      }
    }
  });
};
