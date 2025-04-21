
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        
        // Chamar a Edge Function do Supabase em vez da API da Anthropic diretamente
        const { data, error: funcError } = await supabase.functions.invoke(
          'generate-checklist-anthropic',
          {
            body: {
              projectDetails
            }
          }
        );

        if (funcError) {
          console.error("Erro na chamada da Edge Function:", funcError);
          throw new Error(`Erro ao chamar a função: ${funcError.message}`);
        }

        console.log("Resposta da Edge Function:", data);
        
        if (!data?.items || !Array.isArray(data.items)) {
          throw new Error("Formato de resposta inválido da função");
        }
        
        return data.items;
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
