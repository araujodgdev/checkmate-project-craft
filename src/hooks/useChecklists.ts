
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";

// Definindo tipos locais para nossa base de dados
interface ChecklistItem {
  id: string;
  checklist_id: string;
  description: string;
  checked: boolean;
  order_index: number;
  created_at: string;
}

interface Checklist {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
  checklist_items?: ChecklistItem[];
}

export function useChecklists(projectId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Lista checklists de um projeto específico
  const { data, isLoading, error } = useQuery({
    queryKey: ["checklists", projectId],
    queryFn: async () => {
      if (!user || !projectId) return [];
      
      // Usamos type assertion para lidar com as limitações do tipo Supabase
      const { data, error } = await (supabase
        .from("checklists" as any)
        .select(`
          *,
          checklist_items(*)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true }) as any);

      if (error) throw error;
      return data as unknown as Checklist[] || [];
    },
    enabled: !!user && !!projectId,
  });

  // Mutação para criar checklist
  const createChecklist = useMutation({
    mutationFn: async ({ projectId, title }: { projectId: string; title: string }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      // Usamos type assertion para lidar com as limitações do tipo Supabase
      const { error, data } = await (supabase
        .from("checklists" as any)
        .insert({
          project_id: projectId,
          title
        } as any)
        .select()
        .maybeSingle() as any);
        
      if (error) throw error;
      return data as unknown as Checklist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para atualizar checklist
  const updateChecklist = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      // Usamos type assertion para lidar com as limitações do tipo Supabase
      const { error, data } = await (supabase
        .from("checklists" as any)
        .update({ title } as any)
        .eq("id", id)
        .select()
        .maybeSingle() as any);
        
      if (error) throw error;
      return data as unknown as Checklist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para deletar checklist
  const deleteChecklist = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      // Usamos type assertion para lidar com as limitações do tipo Supabase
      const { error } = await (supabase
        .from("checklists" as any)
        .delete()
        .eq("id", id) as any);
        
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
