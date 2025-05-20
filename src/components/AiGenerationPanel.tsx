
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AiGenerationPanelProps {
  onGenerateBpmn: (xml: string) => void;
}

const AiGenerationPanel: React.FC<AiGenerationPanelProps> = ({ onGenerateBpmn }) => {
  const [processDescription, setProcessDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  
  // Verifica se a API está conectada ao carregar o componente e quando o localStorage muda
  useEffect(() => {
    const checkApiConnection = () => {
      const apiKey = localStorage.getItem('openai-api-key');
      setApiConnected(!!apiKey);
    };
    
    // Verifica ao montar o componente
    checkApiConnection();
    
    // Cria um evento para detectar mudanças no localStorage
    const handleStorageChange = () => {
      checkApiConnection();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Também podemos criar um evento customizado para quando a chave API for atualizada
    window.addEventListener('api-key-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('api-key-updated', handleStorageChange);
    };
  }, []);
  
  // Este prompt será enviado para a API do OpenAI, incluindo as instruções especiais de BPMN
  const buildBpmnPrompt = (description: string): string => {
    return `Você é um especialista em modelagem de processos utilizando a notação BPMN 2.0. Com base na descrição do processo fornecida, gere um diagrama BPMN que atenda aos seguintes critérios:

**Requisitos Funcionais:**
- Utilize apenas elementos e atributos definidos no padrão BPMN 2.0, evitando extensões ou atributos específicos de ferramentas, como \`$type\`.
- Inclua os elementos básicos: eventos (início, intermediário e término), atividades (com verbos no infinitivo), gateways (exclusivo e paralelo), pools e lanes (representando os papéis ou departamentos envolvidos).
- Mantenha a lógica do processo clara, evitando gateways em sequência sem atividades intermediárias.
- Certifique-se de que cada gateway de decisão tenha caminhos de fluxo de saída claramente definidos e que todos os caminhos sejam devidamente fechados.
- Utilize eventos de envio e recebimento para representar comunicações entre participantes, garantindo que cada evento de recebimento corresponda a um evento de envio anterior.
- As atividades devem ser descritas de forma clara e específica, preferencialmente com marcadores que indiquem o tipo de tarefa (manual, usuário, serviço, etc.).

**Requisitos Visuais:**
- Aplique as seguintes cores padrão aos eventos:
  - Eventos de Início: Verde
  - Eventos Intermediários: Amarelo
  - Eventos de Término: Vermelho

**Descrição do Processo:**
${description}

Gere XML BPMN válido conforme a especificação BPMN 2.0.
Não inclua atributos não padronizados como $type, customId ou metadata extra.
Responda APENAS com o XML BPMN 2.0 válido e completo, começando com a tag <?xml version="1.0" encoding="UTF-8"?> 
Garanta que o XML inclua os elementos de diagrama (BPMNDiagram) com as posições dos elementos para visualização.
NÃO inclua explicações, apenas o XML.`;
  };

  // Função para sanitizar o XML retornado pela API
  const sanitizeBpmnXml = (xml: string): string => {
    // Remover qualquer texto antes da tag XML
    const xmlStart = xml.indexOf('<?xml');
    if (xmlStart !== -1) {
      return xml.slice(xmlStart);
    }
    
    // Se não encontrar a tag <?xml, procurar pela tag <definitions>
    const definitionsStart = xml.indexOf('<bpmn:definitions') >= 0 ? 
                             xml.indexOf('<bpmn:definitions') : 
                             xml.indexOf('<definitions');
    
    if (definitionsStart !== -1) {
      // Adicionar a tag XML se ela não estiver presente
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml.slice(definitionsStart);
    }
    
    return xml; // Retorna o XML original se não conseguir sanitizar
  };

  // Função para verificar se o XML parece ser válido
  const validateBpmnXml = (xml: string): boolean => {
    // Verificar tags básicas que um XML BPMN deve ter
    const hasXmlDeclaration = xml.includes('<?xml');
    const hasDefinitionsTag = xml.includes('<bpmn:definitions') || xml.includes('<definitions');
    const hasBpmnDiagram = xml.includes('<bpmndi:BPMNDiagram') || xml.includes('<BPMNDiagram');
    
    // Verificar se há erros óbvios
    const hasParserError = xml.includes('parsererror');
    
    return hasXmlDeclaration && hasDefinitionsTag && hasBpmnDiagram && !hasParserError;
  };

  // Generate BPMN using OpenAI API
  const generateBpmn = async () => {
    if (!processDescription.trim()) {
      toast.error('Por favor, descreva o processo primeiro');
      return;
    }

    const apiKey = localStorage.getItem('openai-api-key');
    if (!apiKey) {
      toast.error('Chave API não configurada. Clique em Configurações para adicionar.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = buildBpmnPrompt(processDescription);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado na geração de diagramas BPMN 2.0 em formato XML.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      let generatedXml = data.choices[0].message.content.trim();
      
      // Sanitizar o XML recebido
      generatedXml = sanitizeBpmnXml(generatedXml);
      
      // Validar se o XML parece válido
      if (!validateBpmnXml(generatedXml)) {
        // Tenta extrair XML de backticks ou outros formatos
        const xmlMatch = generatedXml.match(/<\?xml.*?<\/bpmn:definitions>/s) || 
                        generatedXml.match(/<\?xml.*?<\/definitions>/s);
                        
        if (xmlMatch) {
          generatedXml = xmlMatch[0];
        } else {
          throw new Error('O formato XML gerado não é válido');
        }
      }
      
      onGenerateBpmn(generatedXml);
      toast.success('Diagrama BPMN gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar diagrama BPMN:', error);
      toast.error(`Erro: ${error.message || 'Falha na geração do diagrama'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para usar diagrama de exemplo em caso de falha ou testes
  const useSampleDiagram = () => {
    const sampleBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_0n8rfe2">
    <bpmn:participant id="Participant_1" name="Processo de Aprovação de Solicitação" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1">
      <bpmn:lane id="Lane_1" name="Setor de Análise">
        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Gateway_1</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_2" name="Setor de Execução">
        <bpmn:flowNodeRef>Task_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_3</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_1</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_1" name="Início">
      <bpmn:outgoing>SequenceFlow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Analisar Solicitação">
      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:exclusiveGateway id="Gateway_1" name="Aprovado?">
      <bpmn:incoming>SequenceFlow_2</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_3</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_2" sourceRef="Task_1" targetRef="Gateway_1" />
    <bpmn:task id="Task_2" name="Processar Aprovação">
      <bpmn:incoming>SequenceFlow_3</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_3" name="Sim" sourceRef="Gateway_1" targetRef="Task_2" />
    <bpmn:task id="Task_3" name="Notificar Rejeição">
      <bpmn:incoming>SequenceFlow_4</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_4" name="Não" sourceRef="Gateway_1" targetRef="Task_3" />
    <bpmn:endEvent id="EndEvent_1" name="Processo Concluído">
      <bpmn:incoming>SequenceFlow_5</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_5" sourceRef="Task_2" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="SequenceFlow_6" sourceRef="Task_3" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0n8rfe2">
      <bpmndi:BPMNShape id="Participant_1_di" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="129" y="52" width="721" height="378" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_1_di" bpmnElement="Lane_1" isHorizontal="true">
        <dc:Bounds x="159" y="52" width="691" height="180" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_2_di" bpmnElement="Lane_2" isHorizontal="true">
        <dc:Bounds x="159" y="232" width="691" height="198" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="212" y="122" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="218" y="165" width="25" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="300" y="100" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="455" y="115" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="454" y="85" width="52" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_2_di" bpmnElement="Task_2">
        <dc:Bounds x="560" y="280" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_3_di" bpmnElement="Task_3">
        <dc:Bounds x="350" y="280" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="732" y="302" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="722" y="345" width="56" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1_di" bpmnElement="SequenceFlow_1">
        <di:waypoint x="248" y="140" />
        <di:waypoint x="300" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_2_di" bpmnElement="SequenceFlow_2">
        <di:waypoint x="400" y="140" />
        <di:waypoint x="455" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_3_di" bpmnElement="SequenceFlow_3">
        <di:waypoint x="480" y="165" />
        <di:waypoint x="480" y="320" />
        <di:waypoint x="560" y="320" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="486" y="240" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_4_di" bpmnElement="SequenceFlow_4">
        <di:waypoint x="455" y="140" />
        <di:waypoint x="400" y="140" />
        <di:waypoint x="400" y="280" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="419" y="122" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_5_di" bpmnElement="SequenceFlow_5">
        <di:waypoint x="660" y="320" />
        <di:waypoint x="732" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_6_di" bpmnElement="SequenceFlow_6">
        <di:waypoint x="350" y="320" />
        <di:waypoint x="330" y="320" />
        <di:waypoint x="330" y="350" />
        <di:waypoint x="732" y="350" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    onGenerateBpmn(sampleBpmnXml);
    toast.success('Diagrama BPMN de exemplo carregado');
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Gerar Diagrama BPMN com IA</h2>
        <div className="flex items-center">
          {apiConnected ? (
            <span className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              API Conectada
            </span>
          ) : (
            <span className="text-xs text-red-500 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              API Desconectada
            </span>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-4">
        Usando GPT-4o-mini com BPMN 2.0
      </div>
      
      <Textarea 
        value={processDescription}
        onChange={(e) => setProcessDescription(e.target.value)}
        placeholder="Descreva o processo de negócio que você deseja modelar..."
        className="min-h-32 mb-4"
      />
      
      <div className="flex gap-2">
        <Button 
          onClick={generateBpmn} 
          disabled={isGenerating || !processDescription.trim() || !apiConnected}
          className="flex-grow"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            'Gerar BPMN'
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={useSampleDiagram}
          disabled={isGenerating}
        >
          Usar Exemplo
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Padrão de Cores BPMN:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Eventos de Início: <span className="inline-block w-3 h-3 bg-[#B7F774] border border-[#2ECC40] rounded-full mr-1"></span> Verde</li>
          <li>Eventos de Fim: <span className="inline-block w-3 h-3 bg-[#FFB3B3] border border-[#FF0000] rounded-full mr-1"></span> Vermelho</li>
          <li>Eventos Intermediários: <span className="inline-block w-3 h-3 bg-[#FFE599] border border-[#B7B700] rounded-full mr-1"></span> Amarelo</li>
          <li>Atividades: <span className="inline-block w-3 h-3 bg-white border border-black mr-1"></span> Branco</li>
          <li>Gateways: <span className="inline-block w-3 h-3 bg-white border border-black transform rotate-45 mr-1"></span> Branco</li>
        </ul>
      </div>
    </div>
  );
};

export default AiGenerationPanel;
