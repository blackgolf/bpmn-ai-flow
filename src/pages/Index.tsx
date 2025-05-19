import React, { useState } from 'react';
import Layout from '@/components/Layout';
import BpmnViewer from '@/components/BpmnViewer';
import AiGenerationPanel from '@/components/AiGenerationPanel';
import XmlViewer from '@/components/XmlViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
const Index = () => {
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('diagram');
  const handleGenerateBpmn = (xml: string) => {
    setBpmnXml(xml);
    setActiveTab('diagram');
    toast.success('Diagrama BPMN gerado com sucesso!');
  };
  return <Layout>
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Diagramas BPMN com IA</h1>
          <p className="text-sm text-muted-foreground">
            Crie, visualize e edite diagramas de processo de negócios usando IA
          </p>
        </div>

        <div className="flex-grow flex overflow-hidden p-4 gap-4">
          <div className="w-1/3 flex flex-col gap-4">
            <AiGenerationPanel onGenerateBpmn={handleGenerateBpmn} />
            <Card className="flex-grow">
              <XmlViewer xml={bpmnXml} />
            </Card>
          </div>

          <div className="w-2/3 flex flex-col gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <TabsList>
                <TabsTrigger value="diagram">Diagrama</TabsTrigger>
                <TabsTrigger value="xml">XML</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagram" className="flex-grow border rounded-md p-0 mt-2">
                {bpmnXml ? <div className="h-full">
                    <BpmnViewer bpmnXml={bpmnXml} />
                  </div> : <div className="h-full flex items-center justify-center text-muted-foreground">
                    Descreva um processo e clique em "Gerar BPMN" para iniciar
                  </div>}
              </TabsContent>
              
              <TabsContent value="xml" className="flex-grow p-0 mt-2">
                <XmlViewer xml={bpmnXml} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Index;