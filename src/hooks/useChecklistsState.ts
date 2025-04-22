
import { useState } from "react";
import { toast } from "sonner";
import { useChecklistItems } from "./useChecklistItems";
import { useProject } from "./useProject";

export function useChecklistsState(projectId: string | undefined, isPublicRoute: boolean) {
  const [filter, setFilter] = useState("all");
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [addingChecklistItem, setAddingChecklistItem] = useState<string | null>(null);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const { createItem, toggleItemStatus } = useChecklistItems();
  const { createChecklist } = useProject(projectId);

  const handleTaskChange = async (taskId: string, checked: boolean) => {
    if (isPublicRoute) return;
    
    try {
      await toggleItemStatus.mutateAsync({ id: taskId, checked });
    } catch (error) {
      console.error("Erro ao alterar status da tarefa:", error);
      toast.error("Erro ao alterar status da tarefa");
    }
  };

  const handleCreateChecklist = async () => {
    if (isPublicRoute || !newChecklistTitle.trim() || !projectId) return;
    
    try {
      setIsAddingChecklist(true);
      await createChecklist.mutateAsync({ 
        projectId,
        title: newChecklistTitle 
      });
      setNewChecklistTitle("");
      toast.success("Checklist criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
      toast.error("Erro ao criar checklist");
    } finally {
      setIsAddingChecklist(false);
    }
  };

  const handleCreateItem = async (checklistId: string) => {
    if (isPublicRoute || !newItemText.trim()) return;
    
    try {
      await createItem.mutateAsync({ 
        checklistId, 
        description: newItemText 
      });
      setNewItemText("");
      toast.success("Item adicionado ao checklist");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast.error("Erro ao adicionar item ao checklist");
    } finally {
      setAddingChecklistItem(null);
    }
  };

  return {
    filter,
    setFilter,
    openCategories,
    setOpenCategories,
    newChecklistTitle,
    setNewChecklistTitle,
    newItemText,
    setNewItemText,
    addingChecklistItem,
    setAddingChecklistItem,
    isAddingChecklist,
    handleTaskChange,
    handleCreateChecklist,
    handleCreateItem
  };
}
