
import React, { useState } from "react";
import { TaskItem } from "./TaskItem";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Check, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AddChecklistItemForm } from "./AddChecklistItemForm";
import { toast } from "sonner";

interface ChecklistItemProps {
  checklist: {
    id: string;
    title: string;
    checklist_items?: Array<{
      id: string;
      description: string;
      checked: boolean;
      due_date?: string | null;
      is_critical?: boolean;
    }>;
  };
  isOpen: boolean;
  onToggle: () => void;
  filter: string;
}

export function ChecklistItem({ checklist, isOpen, onToggle, filter }: ChecklistItemProps) {
  const [newItemText, setNewItemText] = useState("");
  const [newItemDueDate, setNewItemDueDate] = useState<Date | null>(null);
  const [newItemIsCritical, setNewItemIsCritical] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  const { createItem, toggleItemStatus, deleteItem } = useChecklistItems();

  const handleCreateItem = async () => {
    if (!newItemText.trim()) return;
    
    try {
      await createItem.mutateAsync({
        checklistId: checklist.id,
        description: newItemText,
        dueDate: newItemDueDate,
        isCritical: newItemIsCritical,
      });
      
      console.log("Item criado com data:", newItemDueDate, "e crítico:", newItemIsCritical);
      
      setNewItemText("");
      setNewItemDueDate(null);
      setNewItemIsCritical(false);
      toast.success("Item adicionado ao checklist!");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast.error("Não foi possível adicionar item!");
    } finally {
      setIsAddingItem(false);
    }
  };

  const filteredItems = checklist.checklist_items?.filter(item => {
    if (filter === "all") return true;
    if (filter === "incomplete") return !item.checked;
    if (filter === "completed") return item.checked;
    return true;
  }) || [];

  const totalItems = filteredItems.length;
  const completedItems = filteredItems.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Collapsible 
      open={isOpen}
      className="border rounded-md"
    >
      <CollapsibleTrigger asChild>
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                isOpen ? "transform rotate-0" : "transform rotate-[-90deg]"
              )}
            />
            <div>
              <h3 className="font-medium">{checklist.title}</h3>
              <div className="text-sm text-muted-foreground">
                {completedItems}/{totalItems} tarefas concluídas
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">{progress}%</div>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  progress === 100 ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="px-4 pb-4">
          <Separator className="mb-4" />
          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TaskItem
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  checked={item.checked}
                  dueDate={item.due_date}
                  isCritical={item.is_critical}
                  checklistId={checklist.id}
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2">
                Nenhuma tarefa encontrada para este critério
              </div>
            )}
            
            {isAddingItem ? (
              <AddChecklistItemForm
                value={newItemText}
                onChange={setNewItemText}
                dueDate={newItemDueDate}
                onDueDateChange={setNewItemDueDate}
                isCritical={newItemIsCritical}
                onIsCriticalChange={setNewItemIsCritical}
                onSubmit={handleCreateItem}
                onCancel={() => setIsAddingItem(false)}
                loading={createItem.isPending}
              />
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="mt-3 w-full justify-start text-muted-foreground"
                onClick={() => setIsAddingItem(true)}
              >
                <Plus size={16} className="mr-2" />
                Adicionar tarefa
              </Button>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
