
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";

export function useChecklists(projectId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Lista checklists de um projeto específico
  const { data, isLoading, error } = useQuery({
    queryKey: ["checklists", projectId],
    queryFn: async () => {
      if (!user || !projectId) return [];
      
      const { data, error } = await supabase
        .from("checklists")
        .select(`
          *,
          checklist_items(*)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!projectId,
  });

  // Mutação para criar checklist
  const createChecklist = useMutation({
    mutationFn: async ({ projectId, title }: { projectId: string; title: string }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error, data } = await supabase
        .from("checklists")
        .insert({
          project_id: projectId,
          title
        })
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para atualizar checklist
  const updateChecklist = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error, data } = await supabase
        .from("checklists")
        .update({ title })
        .eq("id", id)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para deletar checklist
  const deleteChecklist = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error } = await supabase
        .from("checklists")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  return {
    checklists: data,
    isLoading,
    error,
    createChecklist,
    updateChecklist,
    deleteChecklist
  };
}
