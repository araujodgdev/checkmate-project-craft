
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";
import { useChecklists } from "./useChecklists";
import { useProjects } from "./useProjects";

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: string;
  technologies: string[] | null;
  progress: number;
  deadline: string | null;
  created_at: string | null;
  is_public: boolean; // Added missing is_public property
}

export function useProject(projectId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  
  // Armazena o ID do projeto atual para uso em outros hooks
  if (projectId) {
    queryClient.setQueryData(["currentProjectId"], projectId);
  }

  // Busca detalhes de um projeto específico
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!user || !projectId) return null;
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Project;
    },
    enabled: !!user && !!projectId,
  });

  // Obtém os hooks necessários
  const { 
    updateProject, 
    deleteProject 
  } = useProjects();
  
  const { 
    checklists, 
    isLoading: isLoadingChecklists, 
    error: checklistsError,
    createChecklist,
    updateChecklist,
    deleteChecklist
  } = useChecklists(projectId);

  return {
    project,
    isLoading: isLoading || isLoadingChecklists,
    error: error || checklistsError,
    updateProject,
    deleteProject,
    checklists,
    createChecklist,
    updateChecklist,
    deleteChecklist
  };
}
