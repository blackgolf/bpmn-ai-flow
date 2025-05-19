
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface XmlViewerProps {
  xml: string | null;
}

const XmlViewer: React.FC<XmlViewerProps> = ({ xml }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!xml) return;
    
    navigator.clipboard.writeText(xml)
      .then(() => {
        setIsCopied(true);
        toast.success('XML copiado para a área de transferência');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
        toast.error('Erro ao copiar XML');
      });
  };

  return (
    <div className="border rounded-md p-4 bg-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Código XML</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={copyToClipboard}
          disabled={!xml}
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </>
          )}
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        {xml ? (
          <pre className="text-xs whitespace-pre-wrap overflow-auto p-2 bg-muted rounded-md">
            {xml}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Nenhum XML BPMN disponível
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default XmlViewer;
