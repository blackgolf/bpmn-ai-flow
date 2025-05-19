
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
      
      // For demo purposes, we'll just return a simple BPMN XML
      setTimeout(() => {
        const sampleBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
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
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="155" y="145" width="31" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1_di" bpmnElement="SequenceFlow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="395" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="392" y="65" width="55" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_2_di" bpmnElement="SequenceFlow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="395" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Task_2_di" bpmnElement="Task_2">
        <dc:Bounds x="500" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_3_di" bpmnElement="SequenceFlow_3">
        <di:waypoint x="445" y="120" />
        <di:waypoint x="500" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="463" y="102" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Task_3_di" bpmnElement="Task_3">
        <dc:Bounds x="500" y="190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_4_di" bpmnElement="SequenceFlow_4">
        <di:waypoint x="420" y="145" />
        <di:waypoint x="420" y="230" />
        <di:waypoint x="500" y="230" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="426" y="184" width="19" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="662" y="142" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="652" y="185" width="56" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_5_di" bpmnElement="SequenceFlow_5">
        <di:waypoint x="600" y="120" />
        <di:waypoint x="631" y="120" />
        <di:waypoint x="631" y="160" />
        <di:waypoint x="662" y="160" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_6_di" bpmnElement="SequenceFlow_6">
        <di:waypoint x="600" y="230" />
        <di:waypoint x="631" y="230" />
        <di:waypoint x="631" y="160" />
        <di:waypoint x="662" y="160" />
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
    </div>
  );
};

export default AiGenerationPanel;
