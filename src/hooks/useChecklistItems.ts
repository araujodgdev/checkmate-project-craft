
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useChecklistItems(checklistId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const projectId = queryClient.getQueryData<string>(["currentProjectId"]);

  // Mutação para criar item de checklist
  const createItem = useMutation({
    mutationFn: async ({ 
      checklistId, 
      description, 
      orderIndex 
    }: { 
      checklistId: string; 
      description: string;
      orderIndex?: number;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error, data } = await supabase
        .from("checklist_items")
        .insert({
          checklist_id: checklistId,
          description,
          order_index: orderIndex || 0
        })
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return data as ChecklistItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para atualizar status do item (checked)
  const toggleItemStatus = useMutation({
    mutationFn: async ({ 
      id, 
      checked 
    }: { 
      id: string; 
      checked: boolean
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error, data } = await supabase
        .from("checklist_items")
        .update({ checked })
        .eq("id", id)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return data as ChecklistItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
      
      // Atualizamos também o progresso do projeto
      updateProjectProgress();
    },
  });

  // Mutação para atualizar descrição do item
  const updateItemDescription = useMutation({
    mutationFn: async ({ 
      id, 
      description 
    }: { 
      id: string; 
      description: string 
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error, data } = await supabase
        .from("checklist_items")
        .update({ description })
        .eq("id", id)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      return data as ChecklistItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
    },
  });

  // Mutação para deletar item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", projectId] });
      
      // Atualizamos também o progresso do projeto
      updateProjectProgress();
    },
  });

  // Função auxiliar para atualizar o progresso do projeto
  const updateProjectProgress = async () => {
    if (!projectId) return;
    
    try {
      // Busca todos os checklists do projeto
      const { data: checklists } = await supabase
        .from("checklists")
        .select(`
          id,
          checklist_items(id, checked)
        `)
        .eq("project_id", projectId);
      
      if (!checklists || checklists.length === 0) return;
      
      // Conta o total de itens e itens concluídos
      let totalItems = 0;
      let completedItems = 0;
      
      checklists.forEach((checklist: any) => {
        if (!checklist.checklist_items) return;
        
        totalItems += checklist.checklist_items.length;
        completedItems += checklist.checklist_items.filter((item: any) => item.checked).length;
      });
      
      // Calcula a porcentagem de progresso
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      // Atualiza o progresso do projeto
      await supabase
        .from("projects")
        .update({ progress })
        .eq("id", projectId);
        
      // Invalida a query de projetos para atualizar o UI
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
    }
  };

  return {
    createItem,
    toggleItemStatus,
    updateItemDescription,
    deleteItem
  };
}
