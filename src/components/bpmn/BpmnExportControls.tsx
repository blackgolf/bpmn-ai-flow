
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BpmnExportControlsProps {
  viewer: any;
  bpmnXml: string | null;
}

const BpmnExportControls: React.FC<BpmnExportControlsProps> = ({ viewer, bpmnXml }) => {
  const exportSvg = async () => {
    if (!viewer) return;
    
    try {
      const { svg } = await viewer.saveSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      saveAs(blob, 'diagrama-bpmn.svg');
      toast.success('Diagrama exportado como SVG');
    } catch (error) {
      console.error('Erro ao exportar SVG:', error);
      toast.error('Erro ao exportar diagrama como SVG');
    }
  };

  const exportPdf = async () => {
    if (!viewer) return;
    
    try {
      // Primeiro obtemos o SVG
      const { svg } = await viewer.saveSVG();
      
      // Criamos um elemento de imagem temporário
      const image = document.createElement('img');
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      // Quando a imagem carregar, criamos o PDF
      image.onload = () => {
        // Determinamos as dimensões com base na proporção da imagem
        const imgWidth = image.width;
        const imgHeight = image.height;
        
        // Criamos o PDF com o tamanho apropriado
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [imgWidth, imgHeight]
        });
        
        pdf.addImage(image, 'SVG', 0, 0, imgWidth, imgHeight);
        pdf.save('diagrama-bpmn.pdf');
        URL.revokeObjectURL(url);
        toast.success('Diagrama exportado como PDF');
      };
      
      image.src = url;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar diagrama como PDF');
    }
  };

  const exportBpmn = () => {
    if (!bpmnXml) return;
    
    try {
      const blob = new Blob([bpmnXml], { type: 'application/xml' });
      saveAs(blob, 'diagrama-bpmn.bpmn');
      toast.success('Arquivo BPMN exportado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar arquivo BPMN:', error);
      toast.error('Erro ao exportar arquivo BPMN');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-1" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportSvg}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPdf}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportBpmn}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como BPMN (Visio)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BpmnExportControls;
