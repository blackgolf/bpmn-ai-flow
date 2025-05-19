
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
  
  // In a real application, this would make a request to a secure backend
  // which would then call the OpenAI API with the proper credentials
  const generateBpmn = async () => {
    if (!processDescription.trim()) {
      toast.error('Por favor, descreva o processo primeiro');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate an API call for now
      // In production, this would call your secure backend
      
      setTimeout(() => {
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
        <di:waypoint x="450" y="320" />
        <di:waypoint x="480" y="320" />
        <di:waypoint x="480" y="280" />
        <di:waypoint x="650" y="280" />
        <di:waypoint x="650" y="250" />
        <di:waypoint x="750" y="250" />
        <di:waypoint x="750" y="302" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

        onGenerateBpmn(sampleBpmnXml);
        setIsGenerating(false);
        toast.success('Diagrama BPMN gerado com sucesso!');
      }, 2000);
    } catch (error) {
      console.error('Erro ao gerar diagrama BPMN:', error);
      toast.error('Erro ao gerar o diagrama BPMN');
      setIsGenerating(false);
    }
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
