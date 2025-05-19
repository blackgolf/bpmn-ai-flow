
import React, { useState } from 'react';
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
  
  // This function generates a customized BPMN diagram based on the process description
  const generateBpmn = async () => {
    if (!processDescription.trim()) {
      toast.error('Por favor, descreva o processo primeiro');
      return;
    }

    setIsGenerating(true);

    try {
      // In a real application, we would send the BPMN prompt and process description to an API
      // For now, we'll simulate the API call by generating a more dynamic BPMN diagram
      setTimeout(() => {
        // Generate a unique ID for this diagram
        const timestamp = Date.now();
        
        // Extract process name and participants from the description
        const processName = extractProcessName(processDescription) || 'Processo de Negócio';
        const participants = extractParticipants(processDescription);
        
        // Generate the XML based on the process description
        const customBpmnXml = generateCustomBpmnXml(
          timestamp,
          processName,
          processDescription,
          participants
        );
        
        onGenerateBpmn(customBpmnXml);
        setIsGenerating(false);
        toast.success('Diagrama BPMN gerado com sucesso!');
      }, 2000);
    } catch (error) {
      console.error('Erro ao gerar diagrama BPMN:', error);
      toast.error('Erro ao gerar o diagrama BPMN');
      setIsGenerating(false);
    }
  };

  // Extract process name from the description (simple heuristic)
  const extractProcessName = (description: string): string | null => {
    // Look for patterns like "processo de X" or "modelar o processo de X"
    const processMatch = description.match(/processo\s+de\s+['"]?([^'".,]+)['"]?/i) || 
                         description.match(/modelar\s+o\s+processo\s+de\s+['"]?([^'".,]+)['"]?/i);
    
    if (processMatch && processMatch[1]) {
      return `Processo de ${processMatch[1].trim()}`;
    }
    
    return null;
  };
  
  // Extract participants/roles from the description
  const extractParticipants = (description: string): string[] => {
    const commonRoles = [
      'Funcionário', 'Gestor', 'RH', 'Cliente', 'Vendedor',
      'Analista', 'Aprovador', 'Gerente', 'Diretor', 'Técnico',
      'Solicitante', 'Executor', 'Financeiro', 'Compras', 'Jurídico'
    ];
    
    // Find mentioned roles in the description
    const foundRoles = commonRoles.filter(role => 
      description.toLowerCase().includes(role.toLowerCase())
    );
    
    // If no specific roles found, provide default ones based on process type
    if (foundRoles.length === 0) {
      if (description.toLowerCase().includes('férias')) {
        return ['Funcionário', 'Gestor', 'RH'];
      } else if (description.toLowerCase().includes('compra')) {
        return ['Solicitante', 'Aprovador', 'Compras'];
      } else {
        return ['Solicitante', 'Analista', 'Executor'];
      }
    }
    
    return foundRoles;
  };
  
  // Generate a custom BPMN XML based on the process description
  const generateCustomBpmnXml = (
    id: number,
    processName: string,
    description: string,
    participants: string[]
  ): string => {
    // Ensure we have at least one participant
    if (participants.length === 0) {
      participants.push('Executor');
    }
    
    // Determine if the process likely involves decision making
    const hasDecision = description.toLowerCase().includes('se ') ||
                        description.toLowerCase().includes('decisão') ||
                        description.toLowerCase().includes('aprovado') ||
                        description.toLowerCase().includes('reprovado');
    
    // Generate lanes XML based on participants
    const lanesXml = participants.map((participant, index) => `
      <bpmn:lane id="Lane_${index + 1}" name="${participant}">
        <bpmn:flowNodeRef>StartEvent_${index === 0 ? '1' : `Lane${index + 1}`}</bpmn:flowNodeRef>
        ${index < participants.length - 1 ? 
          `<bpmn:flowNodeRef>Task_${index + 1}</bpmn:flowNodeRef>` : 
          `<bpmn:flowNodeRef>Task_${index + 1}</bpmn:flowNodeRef>
           <bpmn:flowNodeRef>EndEvent_1</bpmn:flowNodeRef>`}
        ${hasDecision && index === 1 ? '<bpmn:flowNodeRef>Gateway_1</bpmn:flowNodeRef>' : ''}
        ${hasDecision && index === 2 ? '<bpmn:flowNodeRef>Task_Reject</bpmn:flowNodeRef>' : ''}
      </bpmn:lane>`
    ).join('\n');
    
    // Generate flow based on process type and participants
    let flowNodes = '';
    let sequenceFlows = '';
    
    // Start event in first lane
    flowNodes += `
    <bpmn:startEvent id="StartEvent_1" name="Início do Processo">
      <bpmn:outgoing>SequenceFlow_1</bpmn:outgoing>
    </bpmn:startEvent>`;
    
    // First task
    flowNodes += `
    <bpmn:task id="Task_1" name="Iniciar ${processName.replace('Processo de ', '')}">
      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>
      ${hasDecision ? '<bpmn:outgoing>SequenceFlow_2</bpmn:outgoing>' : '<bpmn:outgoing>SequenceFlow_End</bpmn:outgoing>'}
    </bpmn:task>`;
    
    sequenceFlows += `
    <bpmn:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="Task_1" />`;
    
    // Add decision gateway and paths if needed
    if (hasDecision) {
      flowNodes += `
      <bpmn:exclusiveGateway id="Gateway_1" name="Aprovado?">
        <bpmn:incoming>SequenceFlow_2</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_3</bpmn:outgoing>
        <bpmn:outgoing>SequenceFlow_4</bpmn:outgoing>
      </bpmn:exclusiveGateway>`;
      
      flowNodes += `
      <bpmn:task id="Task_2" name="Processar ${processName.replace('Processo de ', '')}">
        <bpmn:incoming>SequenceFlow_3</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_5</bpmn:outgoing>
      </bpmn:task>`;
      
      flowNodes += `
      <bpmn:task id="Task_Reject" name="Rejeitar Solicitação">
        <bpmn:incoming>SequenceFlow_4</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_6</bpmn:outgoing>
      </bpmn:task>`;
      
      sequenceFlows += `
      <bpmn:sequenceFlow id="SequenceFlow_2" sourceRef="Task_1" targetRef="Gateway_1" />
      <bpmn:sequenceFlow id="SequenceFlow_3" name="Sim" sourceRef="Gateway_1" targetRef="Task_2" />
      <bpmn:sequenceFlow id="SequenceFlow_4" name="Não" sourceRef="Gateway_1" targetRef="Task_Reject" />
      <bpmn:sequenceFlow id="SequenceFlow_5" sourceRef="Task_2" targetRef="EndEvent_1" />
      <bpmn:sequenceFlow id="SequenceFlow_6" sourceRef="Task_Reject" targetRef="EndEvent_1" />`;
    } else {
      // Simple process without decisions
      sequenceFlows += `
      <bpmn:sequenceFlow id="SequenceFlow_End" sourceRef="Task_1" targetRef="EndEvent_1" />`;
    }
    
    // End event
    flowNodes += `
    <bpmn:endEvent id="EndEvent_1" name="Processo Concluído">
      ${hasDecision ? 
        '<bpmn:incoming>SequenceFlow_5</bpmn:incoming><bpmn:incoming>SequenceFlow_6</bpmn:incoming>' : 
        '<bpmn:incoming>SequenceFlow_End</bpmn:incoming>'}
    </bpmn:endEvent>`;
    
    // Generate diagram positions
    let diagramXml = `
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0n8rfe2">
        <bpmndi:BPMNShape id="Participant_1_di" bpmnElement="Participant_1" isHorizontal="true">
          <dc:Bounds x="129" y="52" width="721" height="${200 + participants.length * 120}" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
        
    // Lane shapes
    participants.forEach((_, index) => {
      const yPos = 52 + index * 120;
      diagramXml += `
        <bpmndi:BPMNShape id="Lane_${index + 1}_di" bpmnElement="Lane_${index + 1}" isHorizontal="true">
          <dc:Bounds x="159" y="${yPos}" width="691" height="120" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    });
    
    // Start event shape
    diagramXml += `
        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
          <dc:Bounds x="212" y="${52 + 50}" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="200" y="${52 + 93}" width="60" height="27" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>`;
    
    // Task 1 shape
    diagramXml += `
        <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
          <dc:Bounds x="300" y="${52 + 28}" width="100" height="80" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    
    if (hasDecision) {
      // Gateway shape
      diagramXml += `
        <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
          <dc:Bounds x="455" y="${52 + 43}" width="50" height="50" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="454" y="${52 + 13}" width="52" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>`;
      
      // Task 2 shape
      diagramXml += `
        <bpmndi:BPMNShape id="Task_2_di" bpmnElement="Task_2">
          <dc:Bounds x="560" y="${52 + 120 + 40}" width="100" height="80" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
      
      // Task Reject shape
      diagramXml += `
        <bpmndi:BPMNShape id="Task_Reject_di" bpmnElement="Task_Reject">
          <dc:Bounds x="350" y="${52 + 120 + 40}" width="100" height="80" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    }
    
    // End event shape
    const endEventY = hasDecision ? 52 + 240 + 20 : 52 + 50;
    diagramXml += `
        <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
          <dc:Bounds x="732" y="${endEventY}" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="722" y="${endEventY + 43}" width="56" height="27" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>`;
    
    // Sequence flow edges
    diagramXml += `
        <bpmndi:BPMNEdge id="SequenceFlow_1_di" bpmnElement="SequenceFlow_1">
          <di:waypoint x="248" y="${52 + 68}" />
          <di:waypoint x="300" y="${52 + 68}" />
        </bpmndi:BPMNEdge>`;
    
    if (hasDecision) {
      diagramXml += `
        <bpmndi:BPMNEdge id="SequenceFlow_2_di" bpmnElement="SequenceFlow_2">
          <di:waypoint x="400" y="${52 + 68}" />
          <di:waypoint x="455" y="${52 + 68}" />
        </bpmndi:BPMNEdge>
        
        <bpmndi:BPMNEdge id="SequenceFlow_3_di" bpmnElement="SequenceFlow_3">
          <di:waypoint x="480" y="${52 + 93}" />
          <di:waypoint x="480" y="${52 + 160}" />
          <di:waypoint x="560" y="${52 + 160}" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="486" y="${52 + 120}" width="19" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        
        <bpmndi:BPMNEdge id="SequenceFlow_4_di" bpmnElement="SequenceFlow_4">
          <di:waypoint x="455" y="${52 + 68}" />
          <di:waypoint x="400" y="${52 + 68}" />
          <di:waypoint x="400" y="${52 + 160}" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="419" y="${52 + 50}" width="20" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNEdge>
        
        <bpmndi:BPMNEdge id="SequenceFlow_5_di" bpmnElement="SequenceFlow_5">
          <di:waypoint x="660" y="${52 + 160}" />
          <di:waypoint x="732" y="${52 + 160}" />
        </bpmndi:BPMNEdge>
        
        <bpmndi:BPMNEdge id="SequenceFlow_6_di" bpmnElement="SequenceFlow_6">
          <di:waypoint x="350" y="${52 + 160}" />
          <di:waypoint x="300" y="${52 + 160}" />
          <di:waypoint x="300" y="${endEventY + 18}" />
          <di:waypoint x="732" y="${endEventY + 18}" />
        </bpmndi:BPMNEdge>`;
    } else {
      diagramXml += `
        <bpmndi:BPMNEdge id="SequenceFlow_End_di" bpmnElement="SequenceFlow_End">
          <di:waypoint x="400" y="${52 + 68}" />
          <di:waypoint x="566" y="${52 + 68}" />
          <di:waypoint x="566" y="${endEventY + 18}" />
          <di:waypoint x="732" y="${endEventY + 18}" />
        </bpmndi:BPMNEdge>`;
    }
    
    diagramXml += `
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>`;
    
    // Combine everything into the final BPMN XML
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_${id}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_0n8rfe2">
    <bpmn:participant id="Participant_1" name="${processName.substring(0, 100)}" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1">
      ${lanesXml}
    </bpmn:laneSet>
    ${flowNodes}
    ${sequenceFlows}
  </bpmn:process>
  ${diagramXml}
</bpmn:definitions>`;
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <h2 className="text-lg font-medium mb-2">Gerar Diagrama BPMN com IA</h2>
      <div className="text-xs text-muted-foreground mb-4">
        Usando GPT-4o-mini com BPMN 2.0 (Manual de Cores)
      </div>
      
      <Textarea 
        value={processDescription}
        onChange={(e) => setProcessDescription(e.target.value)}
        placeholder="Descreva o processo de negócio que você deseja modelar..."
        className="min-h-32 mb-4"
      />
      
      <Button 
        onClick={generateBpmn} 
        disabled={isGenerating || !processDescription.trim()}
        className="w-full"
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
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Padrão de Cores BPMN:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Eventos de Início: <span className="inline-block w-3 h-3 bg-bpmn-start-event-bg border border-bpmn-start-event-border rounded-full mr-1"></span> Verde</li>
          <li>Eventos de Fim: <span className="inline-block w-3 h-3 bg-bpmn-end-event-bg border border-bpmn-end-event-border rounded-full mr-1"></span> Vermelho</li>
          <li>Atividades: <span className="inline-block w-3 h-3 bg-bpmn-activity-bg border border-bpmn-activity-border mr-1"></span> Branco</li>
          <li>Gateways: <span className="inline-block w-3 h-3 bg-bpmn-gateway-bg border border-bpmn-gateway-border transform rotate-45 mr-1"></span> Branco</li>
        </ul>
      </div>
    </div>
  );
};

export default AiGenerationPanel;
