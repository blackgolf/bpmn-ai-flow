
// Estilos CSS para elementos BPMN
export const bpmnStyles = `
  /* Estilos para Eventos de Início */
  .djs-container .bpmn-icon-start-event circle,
  .djs-container [data-element-id*="StartEvent"] circle {
    fill: #B7F774 !important;
    stroke: #2ECC40 !important;
    stroke-width: 2px !important;
  }
  
  /* Estilos para Eventos de Fim */
  .djs-container .bpmn-icon-end-event circle,
  .djs-container [data-element-id*="EndEvent"] circle {
    fill: #FFB3B3 !important;
    stroke: #FF0000 !important;
    stroke-width: 2px !important;
  }
  
  /* Estilos para Eventos Intermediários */
  .djs-container .bpmn-icon-intermediate-event-none circle,
  .djs-container [data-element-id*="IntermediateThrowEvent"] circle,
  .djs-container [data-element-id*="IntermediateCatchEvent"] circle {
    fill: #FFE599 !important;
    stroke: #B7B700 !important;
    stroke-width: 2px !important;
  }
  
  /* Estilos para Atividades */
  .djs-container .bpmn-icon-task rect,
  .djs-container [data-element-id*="Task"] rect,
  .djs-container [data-element-id*="Activity"] rect {
    fill: #FFFFFF !important;
    stroke: #000000 !important;
    stroke-width: 2px !important;
  }
  
  /* Estilos para Gateways */
  .djs-container .bpmn-icon-gateway-none path,
  .djs-container [data-element-id*="Gateway"] path {
    fill: #FFFFFF !important;
    stroke: #000000 !important;
    stroke-width: 2px !important;
  }
`;

// Função para aplicar cores diretamente ao canvas SVG
export function applyCustomColors(viewer: any) {
  try {
    const elementRegistry = viewer.get('elementRegistry');
    const elements = elementRegistry.getAll();
    
    elements.forEach((element: any) => {
      if (!element || !element.type) return;
      
      const gfx = element.gfx;
      if (!gfx) return;
      
      // Colorir eventos de início
      if (element.type.includes('bpmn:StartEvent')) {
        const circle = gfx.querySelector('circle');
        if (circle) {
          circle.style.fill = '#B7F774';
          circle.style.stroke = '#2ECC40';
        }
      }
      
      // Colorir eventos de fim
      else if (element.type.includes('bpmn:EndEvent')) {
        const circle = gfx.querySelector('circle');
        if (circle) {
          circle.style.fill = '#FFB3B3';
          circle.style.stroke = '#FF0000';
        }
      }
      
      // Colorir eventos intermediários
      else if (element.type.includes('bpmn:IntermediateThrowEvent') || 
               element.type.includes('bpmn:IntermediateCatchEvent')) {
        const circle = gfx.querySelector('circle');
        if (circle) {
          circle.style.fill = '#FFE599';
          circle.style.stroke = '#B7B700';
        }
      }
    });
  } catch (error) {
    console.error('Erro ao aplicar cores personalizadas:', error);
  }
}

// Função para configurar a aplicação de cores após o carregamento do diagrama
export function applyColorsOnImport(viewer: any) {
  viewer.on('import.done', () => {
    try {
      applyCustomColors(viewer);
      
      // Também aplicar cores quando o gráfico for alterado (zoom, movimento, etc.)
      const eventBus = viewer.get('eventBus');
      eventBus.on('canvas.viewbox.changed', () => {
        applyCustomColors(viewer);
      });
    } catch (error) {
      console.error('Erro ao aplicar cores após importação:', error);
    }
  });
}
