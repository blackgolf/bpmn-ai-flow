// pages/api/generate-bpmn.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Sua chave de API
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    try {
      const systemPrompt = `
        Você é um especialista em BPMN 2.0.
        Gere um XML BPMN completo e válido para a descrição do processo fornecida pelo usuário.
        O XML deve incluir:
        1. Um elemento <bpmn:definitions>.
        2. Dentro de <bpmn:definitions>, um <bpmn:collaboration> com um <bpmn:participant>. O atributo processRef do participant deve apontar para o ID do <bpmn:process>.
        3. O <bpmn:process> deve conter um <bpmn:laneSet> com um ou mais elementos <bpmn:lane>, cada um com um nome e referências aos flowNodeRefs contidos nele.
        4. Elementos BPMN básicos como startEvent, endEvent, task, sequenceFlow, e gateways (exclusive, parallel) conforme necessário.
        5. Seções <bpmndi:BPMNDiagram>, <bpmndi:BPMNPlane>, <bpmndi:BPMNShape> e <bpmndi:BPMNEdge> para a representação visual, incluindo coordenadas (Bounds) para os shapes e waypoints para os edges. O bpmnElement do BPMNPlane deve ser o ID da collaboration.
        Responda APENAS com o código XML do BPMN, sem nenhuma explicação ou texto adicional.
      `;

      const completion = await openai.chat.completions.create({
        // MODIFICAÇÃO AQUI:
        model: "gpt-4o", // Ou "gpt-4" ou "gpt-4-turbo", verifique a documentação para os nomes mais atuais e capacidades
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description },
        ],
        temperature: 0.5,
      });

      const bpmnXml = completion.choices[0]?.message?.content;

      if (!bpmnXml) {
        throw new Error('Resposta da API da OpenAI não contém conteúdo.');
      }

      res.status(200).json({ bpmnXml });
    } catch (error: any) {
      console.error('Erro ao chamar API da OpenAI:', error);
      res.status(500).json({ error: 'Falha ao gerar diagrama BPMN', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
