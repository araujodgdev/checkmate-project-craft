
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";
import { useChecklists } from "./useChecklists";
import { useProjects } from "./useProjects";
import { useLocation } from "react-router-dom";

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
  is_public: boolean;
}

export function useProject(projectId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const location = useLocation();
  const isPublicRoute = location.pathname.includes('/public');
  
  // Armazena o ID do projeto atual para uso em outros hooks
  if (projectId) {
    queryClient.setQueryData(["currentProjectId"], projectId);
  }

  // Busca detalhes de um projeto específico
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId, isPublicRoute],
    queryFn: async () => {
      if (!projectId) return null;
      
      let query = supabase
        .from("projects")
        .select("*")
        .eq("id", projectId);
      
      // Se não for uma rota pública, aplica o filtro de user_id
      if (!isPublicRoute && user) {
        query = query.eq("user_id", user.id);
      } else if (isPublicRoute) {
        // Para rotas públicas, verifica se o projeto é público
        query = query.eq("is_public", true);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as Project;
    },
    enabled: !!projectId,
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
    deleteChecklist,
    upcomingTasks
  } = useChecklists(projectId, isPublicRoute);

  return {
    project,
    isLoading: isLoading || isLoadingChecklists,
    error: error || checklistsError,
    updateProject,
    deleteProject,
    checklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    upcomingTasks,
    isPublicRoute
  };
}
