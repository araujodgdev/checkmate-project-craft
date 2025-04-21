
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar a chave da API
  const getApiKey = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-anthropic-key');
      
      if (error) {
        console.error('Erro ao buscar chave da API:', error);
        throw new Error(`Erro ao obter chave da API: ${error.message || 'Erro desconhecido'}`);
      }
      
      if (!data?.key) {
        throw new Error('Chave da API não encontrada na resposta');
      }
      
      return data.key;
    } catch (err: any) {
      console.error('Falha ao buscar chave da API:', err);
      throw new Error(err?.message || 'Erro ao buscar chave da API');
    }
  };

  // Mutação para gerar checklist usando a API da Anthropic
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
        console.log("Detalhes do projeto enviados:", projectDetails);
        
        // Obter a chave da API
        const apiKey = await getApiKey();
        
        // Montar o prompt para a API da Anthropic
        const prompt = `
Você é um especialista em desenvolvimento de software.
Gere uma checklist detalhada (10 a 14 itens) para organização e entrega de um projeto com as seguintes caraterísticas:

- Nome do projeto: ${projectDetails.name}
- Descrição: ${projectDetails.description}
- Tipo do projeto: ${projectDetails.type}
- Tecnologias principais: ${projectDetails.technologies.join(", ")}
- Objetivos: ${projectDetails.objectives}

A checklist deve ser prática e cobrir planejamento, autenticação, lógica, integrações, qualidade de código e entrega do produto.
Formato da resposta estritamente:
CHECKLIST:
1. [Passo mais importante 1]
2. [Passo importante 2]
...
(Obs: não inclua textos extras, apenas a lista numerada e clara).`;

        // Chamada direta para a API da Anthropic
        console.log("Enviando requisição para API da Anthropic...");
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 1024,
            temperature: 0.2,
            messages: [
              { role: "user", content: prompt }
            ]
          }),
        });

        // Log do status da resposta
        console.log("Status da resposta da API:", response.status);
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro da API da Anthropic:", errorText);
          throw new Error(`Erro na API da Anthropic (${response.status}): ${errorText}`);
        }

        // Processar a resposta
        const data = await response.json();
        console.log("Resposta da API (primeiros 100 caracteres):", 
          JSON.stringify(data).slice(0, 100) + "...");
        
        // Extrair o texto da resposta
        let checklist = "";
        if (data?.content && Array.isArray(data.content)) {
          checklist = data.content.map((c: any) => c.text).join("").trim();
        } else {
          checklist = data?.content?.text || "";
        }
        
        console.log("Checklist extraída (primeiros 100 caracteres):", 
          checklist.slice(0, 100) + "...");

        // Processar a checklist em itens
        let items = checklist
          .split("\n")
          .map((l: string) => l.replace(/^\d+(\.|\))/,"").trim())
          .filter((l: string) => l.length > 0 && !l.toLowerCase().startsWith("checklist:"));

        // Caso checklist esteja toda em uma linha, dividir no ponto
        if (items.length < 4) {
          console.log("Checklist com menos de 4 itens, tentando parsing alternativo");
          items = checklist.split(/[0-9]+\./).map((t: string) => t.trim()).filter(Boolean);
        }
        
        console.log("Número final de itens processados:", items.length);
        
        return items;
      } catch (err: any) {
        console.error("Erro completo:", err);
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
