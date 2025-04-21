
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

// !!! ATENÇÃO: sua chave será exposta no frontend após editar aqui.
// Produção recomenda sempre usar um backend.
const ANTHROPIC_API_KEY = "SUA_CHAVE_ANTHROPIC_AQUI";

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChecklist = useMutation({
    mutationFn: async (projectDetails: {
      name: string;
      description: string;
      type: string;
      technologies: string[];
      objectives: string;
      deadline?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        // Monta prompt ou convert projectDetails para a mensagem desejada pelo seu modelo Anthropic
        const anthropicPayload = {
          model: "claude-3-haiku-20240307", // ajuste conforme o modelo contratado
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content:
                `Crie um checklist para desenvolvimento do projeto:\n\n` +
                `Nome: ${projectDetails.name}\n` +
                `Descrição: ${projectDetails.description}\n` +
                `Tipo: ${projectDetails.type}\n` +
                `Tecnologias: ${projectDetails.technologies.join(", ")}\n` +
                `Objetivos: ${projectDetails.objectives}\n` +
                (projectDetails.deadline ? `Deadline: ${projectDetails.deadline}\n` : '') +
                `\nMe retorne apenas uma lista de checklist em português, separada por QUEBRA DE LINHA e SEM NENHUM COMPLEMENTO, só a lista mesmo.`
            }
          ]
        };

        // Faz a requisição para Anthropic direto via fetch
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
            // CORS: O navegador vai adicionar a Origin automaticamente
          },
          body: JSON.stringify(anthropicPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro Anthropic: ${errorText}`);
        }

        const data = await response.json();

        // Esperamos que a resposta venha em data.content[0]?.text (verifique a estrutura real do retorno)
        const checklistText = data?.content?.[0]?.text || '';
        if (!checklistText) throw new Error("A resposta da IA veio vazia!");

        // Divide a resposta em itens do checklist, assumindo um item por linha
        const items = checklistText
          .split(/\r?\n/)
          .map((t: string) => t.trim())
          .filter(Boolean);

        return items;
      } catch (err: any) {
        setError(err?.message || "Falha ao gerar checklist");
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  });

  return {
    generateChecklist,
    isLoading,
    error
  };
}
