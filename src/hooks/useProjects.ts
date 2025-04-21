
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";

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
  completed?: boolean; // nova propriedade
}

export function useProjects() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Lista projetos do usuário autenticado, junto com checklists e items
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!user) return [];
      // Buscando projetos, checklists e checklist_items em uma única consulta
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          checklists:checklists(
            id,
            checklist_items(
              id,
              checked
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Processa se projeto está concluído: todos os checklist_items (de todos os checklists) marcados
      const projectsWithCompleted = (data as any[]).map((project: any) => {
        const checklists = project.checklists ?? [];
        // Juntando todos os checklist_items dos checklists do projeto
        const allItems = checklists.flatMap(
          (c: any) => c.checklist_items ?? []
        );
        // Se não há itens, está sempre em progresso
        if (allItems.length === 0) {
          return { ...project, completed: false };
        }
        // Se todos os itens estão checked, concluído
        const completed = allItems.every((item: any) => item.checked);
        return { ...project, completed };
      });

      // Remove a propriedade checklists para não poluir o Project retornado
      return projectsWithCompleted.map(({ checklists, ...rest }) => rest) as Project[];
    },
    enabled: !!user,
  });

  // Mutação para criar projeto
  const createProject = useMutation({
    mutationFn: async (project: {
      name: string;
      description?: string;
      type: string;
      technologies: string[];
      deadline?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      const { error, data } = await supabase
        .from("projects")
        .insert({
          ...project,
          user_id: user.id,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Mutação para atualizar projeto
  const updateProject = useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string;
      name?: string;
      description?: string;
      type?: string;
      technologies?: string[];
      progress?: number;
      deadline?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      const { error, data } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Mutação para deletar projeto
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: data,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject
  };
}
