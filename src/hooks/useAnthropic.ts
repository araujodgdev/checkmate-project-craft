
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ProjectDetails = {
  name: string;
  description: string;
  type: string;
  technologies: string[];
  objectives: string;
  deadline?: string;
};

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChecklist = async (projectDetails: ProjectDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      // Obter a sessão atual para usar o token de autenticação
      const { data: authData } = await supabase.auth.getSession();
      
      const { data, error: funcError } = await supabase.functions.invoke(
        "generate-checklist-anthropic",
        {
          body: { projectDetails },
          headers: authData?.session?.access_token 
            ? { Authorization: `Bearer ${authData.session.access_token}` }
            : undefined
        }
      );

      if (funcError) {
        throw new Error(funcError.message || "Erro ao chamar checklist IA");
      }

      // Esperamos { items: [...] }
      if (!data?.items || !Array.isArray(data.items)) {
        throw new Error("Formato inesperado na resposta da edge function");
      }

      return data.items as string[];
    } catch (err: any) {
      setError(err?.message || "Falha ao gerar checklist");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateChecklist,
    isLoading,
    error,
  };
}
