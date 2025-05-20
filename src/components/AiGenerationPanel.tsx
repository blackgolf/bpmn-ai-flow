
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
    return `Você é um especialista em BPMN 2.0 e deve gerar um XML completamente válido, seguindo o padrão aceito por modeladores como Camunda Modeler, bpmn-js e Loveable.dev.

INSTRUÇÕES PARA O XML BPMN:
- Use o namespace: http://www.omg.org/spec/BPMN/20100524/MODEL
- Comece com a tag <?xml version="1.0" encoding="UTF-8"?> seguida de <bpmn:definitions>
- NÃO inclua nenhum texto fora do XML
- Inclua <bpmn:collaboration> com <bpmn:participant> referenciando o processo
- Use <bpmn:process> com isExecutable="false"
- Dentro do processo, adicione:
  - <bpmn:laneSet> com lanes (raias), se aplicável
  - Cada <bpmn:lane> deve conter <bpmn:flowNodeRef> com os IDs dos elementos (tarefas, gateways, eventos) pertencentes àquela lane
  - Eventos de início, atividades com verbos no infinitivo, gateways, eventos de término
  - <bpmn:sequenceFlow> conectando os elementos corretamente
- Inclua <bpmndi:BPMNDiagram> com shapes e edges para visualização
- NÃO use atributos inválidos como $type, customId, nem namespaces não padronizados
- NÃO inclua explicações ou comentários fora do XML

Boas práticas para o Diagrama:
- Use swimlanes quando diferentes setores ou papéis estiverem envolvidos
- Nomeie as atividades com verbos no infinitivo
- Utilize gateways para decisões e paralelismo (fechando corretamente)
- Evite colocar dois gateways em sequência sem atividades intermediárias
- Para comunicação entre participantes, utilize eventos de envio e recebimento em pares

Estilo Visual:
- Evento de Início:  Verde
- Evento Intermediário:  Amarelo
- Evento de Término:  Vermelho
- Tarefas e gateways: Branco

Abaixo está a descrição do processo a ser transformado em BPMN:

**Descrição do Processo:**

"${description}"

Responda APENAS com o XML BPMN 2.0 válido e completo, começando com a tag <?xml version="1.0" encoding="UTF-8"?>
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
      
<<<<<<< HEAD
      setTimeout(() => {
        const sampleBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_ISU33_BloqueioDeAcesso" name="ISU33 - Bloqueio de Acesso" isExecutable="true">
    <bpmn:startEvent id="StartEvent_ChamadoRecebido" name="Chamado recebido via Agidesk">
      <bpmn:outgoing>Flow1</bpmn:outgoing>
=======
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
>>>>>>> d9e5aa1f5fc50752c23540b99aeb8b4b5f019227
    </bpmn:startEvent>

    <bpmn:task id="Task_EnviarEmailNadaConsta" name="Enviar e-mail para o grupo NADA CONSTA">
      <bpmn:incoming>Flow1</bpmn:incoming>
      <bpmn:outgoing>Flow2</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_ChecarEmail" name="Checar e-mail">
      <bpmn:incoming>Flow2</bpmn:incoming>
      <bpmn:outgoing>Flow3</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_ReceberNadaConsta" name="Recebimento de 'NADA CONSTA'">
      <bpmn:incoming>Flow3</bpmn:incoming>
      <bpmn:outgoing>Flow4</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_EnviarEmailInfra" name="Enviar e-mail para Infra">
      <bpmn:incoming>Flow4</bpmn:incoming>
      <bpmn:outgoing>Flow5</bpmn:outgoing>
    </bpmn:task>

    <bpmn:task id="Task_BloquearAcessos" name="Bloquear acessos no AD e E-mail">
      <bpmn:incoming>Flow5</bpmn:incoming>
      <bpmn:outgoing>Flow6</bpmn:outgoing>
    </bpmn:task>

    <bpmn:endEvent id="EndEvent_AcessosBloqueados" name="Acessos bloqueados">
      <bpmn:incoming>Flow6</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Flows -->
    <bpmn:sequenceFlow id="Flow1" sourceRef="StartEvent_ChamadoRecebido" targetRef="Task_EnviarEmailNadaConsta"/>
    <bpmn:sequenceFlow id="Flow2" sourceRef="Task_EnviarEmailNadaConsta" targetRef="Task_ChecarEmail"/>
    <bpmn:sequenceFlow id="Flow3" sourceRef="Task_ChecarEmail" targetRef="Task_ReceberNadaConsta"/>
    <bpmn:sequenceFlow id="Flow4" sourceRef="Task_ReceberNadaConsta" targetRef="Task_EnviarEmailInfra"/>
    <bpmn:sequenceFlow id="Flow5" sourceRef="Task_EnviarEmailInfra" targetRef="Task_BloquearAcessos"/>
    <bpmn:sequenceFlow id="Flow6" sourceRef="Task_BloquearAcessos" targetRef="EndEvent_AcessosBloqueados"/>
  </bpmn:process>
<<<<<<< HEAD
=======
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
>>>>>>> d9e5aa1f5fc50752c23540b99aeb8b4b5f019227
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
