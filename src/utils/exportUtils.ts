
import { saveAs } from 'file-saver';

export const exportBpmnXml = (bpmnXml: string, filename: string = 'diagram') => {
  const blob = new Blob([bpmnXml], { type: 'application/xml' });
  saveAs(blob, `${filename}.bpmn`);
};

export const exportBpmnSvg = async (viewer: any, filename: string = 'diagram') => {
  if (!viewer) return;
  
  try {
    const { svg } = await viewer.saveSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
};

export const exportBpmnPng = async (viewer: any, filename: string = 'diagram') => {
  if (!viewer) return;
  
  try {
    const canvas = viewer.get('canvas');
    const viewbox = canvas.viewbox();
    
    // Create a canvas element for rendering
    const domCanvas = document.createElement('canvas');
    const context = domCanvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    
    // Set canvas dimensions
    const { width, height } = viewbox;
    domCanvas.width = width;
    domCanvas.height = height;
    
    // Get SVG content
    const { svg } = await viewer.saveSVG();
    
    // Create image from SVG
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    // Wait for image to load
    img.onload = () => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      context.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to blob
      domCanvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${filename}.png`);
        }
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    
    img.src = url;
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
};
