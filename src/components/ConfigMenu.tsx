
import React, { useState, useEffect } from 'react';
import { Settings, Check, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const ConfigMenu: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Carrega a chave API do localStorage ao montar o componente
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      verifyApiKey(savedApiKey);
    }
  }, []);
  
  // Verifica se a chave API é válida
  const verifyApiKey = async (key: string) => {
    if (!key.trim()) {
      setIsConnected(false);
      return;
    }
    
    try {
      // Faz uma requisição simples para verificar se a chave é válida
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });
      
      if (response.ok) {
        setIsConnected(true);
        toast.success('API OpenAI conectada com sucesso!');
      } else {
        setIsConnected(false);
        toast.error('Chave API inválida ou expirada');
      }
    } catch (error) {
      console.error('Erro ao verificar chave API:', error);
      setIsConnected(false);
      toast.error('Erro ao conectar com a API OpenAI');
    }
  };
  
  // Salva a chave API no localStorage
  const saveApiKey = () => {
    localStorage.setItem('openai-api-key', apiKey);
    verifyApiKey(apiKey);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
          {isConnected && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-lg flex items-center">
            Configurações API
            {isConnected ? (
              <span className="ml-2 text-green-500 flex items-center text-sm">
                <Check className="h-4 w-4 mr-1" /> Conectado
              </span>
            ) : (
              <span className="ml-2 text-red-500 flex items-center text-sm">
                <CircleX className="h-4 w-4 mr-1" /> Desconectado
              </span>
            )}
          </h4>
          
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Chave API OpenAI (GPT-4o-mini)
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Insira sua chave API da OpenAI para gerar diagramas BPMN.
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-blue-500 hover:underline"
              >
                Obter chave
              </a>
            </p>
          </div>
          
          <Button onClick={saveApiKey} className="w-full">
            Salvar e conectar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfigMenu;
