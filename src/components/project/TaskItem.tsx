
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TaskDatePicker } from "./TaskDatePicker";
import { MeetingScheduler } from "./MeetingScheduler";
import { Calendar, Check, Clock, Edit, Trash2, Save, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskItemProps {
  id: string;
  description: string;
  checked: boolean;
  dueDate?: string | null;
  isCritical?: boolean;
  checklistId: string;
  onStatusChange?: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({
  id,
  description,
  checked,
  dueDate,
  isCritical = false,
  checklistId,
  onStatusChange,
  onDelete
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    toggleItemStatus,
    updateItemDescription,
    updateItemDueDate,
    toggleItemCritical,
    deleteItem
  } = useChecklistItems(checklistId);

  const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
  
  const handleDueDateChange = async (date: Date | undefined) => {
    try {
      await updateItemDueDate.mutateAsync({
        id,
        dueDate: date || null
      });
      
      if (date) {
        toast.success("Data de prazo definida com sucesso");
      } else {
        toast.info("Data de prazo removida");
      }
      
      setShowDatePicker(false);
    } catch (error) {
      console.error("Erro ao atualizar data:", error);
      toast.error("Erro ao definir data de prazo");
    }
  };

  const handleStatusChange = async (checked: boolean) => {
    if (onStatusChange) {
      onStatusChange(id, checked);
    } else {
      try {
        await toggleItemStatus.mutateAsync({
          id,
          checked
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
        toast.error("Erro ao alterar status da tarefa");
      }
    }
  };

  const handleSaveDescription = async () => {
    if (editedDescription.trim() === "") return;
    
    try {
      await updateItemDescription.mutateAsync({
        id,
        description: editedDescription
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar descrição:", error);
      toast.error("Erro ao atualizar descrição");
    }
  };

  const toggleCritical = async () => {
    try {
      await toggleItemCritical.mutateAsync({
        id,
        isCritical: !isCritical
      });
      
      if (!isCritical) {
        toast.info("Tarefa marcada como crítica");
      } else {
        toast.info("Tarefa não é mais crítica");
      }
    } catch (error) {
      console.error("Erro ao marcar como crítica:", error);
      toast.error("Erro ao atualizar prioridade da tarefa");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Item removido com sucesso");
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      toast.error("Erro ao remover item");
    }
  };

  const getDateStatus = () => {
    if (!parsedDueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(parsedDueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (checked) return "completed";
    if (isBefore(dueDate, today)) return "overdue";
    if (isBefore(dueDate, addDays(today, 3))) return "soon";
    return "normal";
  };

  const dateStatus = getDateStatus();

  return (
    <div 
      className="flex items-start gap-3 group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => isMobile && setShowActions(!showActions)}
    >
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => 
          handleStatusChange(checked as boolean)
        }
        className="mt-0.5"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button 
              size="sm" 
              onClick={handleSaveDescription}
              disabled={editedDescription.trim() === ""}
            >
              <Save size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            <div className="flex items-start justify-between">
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium cursor-pointer flex-1 mr-2",
                  checked && "line-through text-muted-foreground"
                )}
              >
                {description}
                {isCritical && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Crítico
                  </Badge>
                )}
              </label>
              
              <div className={cn(
                "flex items-center gap-1 transition-opacity",
                (!isMobile && !showActions) ? "opacity-0 group-hover:opacity-100" : "opacity-100",
                isMobile && "absolute top-0 right-0 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm",
                !showActions && isMobile && "hidden"
              )}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={14} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground" 
                  onClick={handleDelete}
                >
                  <Trash2 size={14} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-6 w-6",
                    isCritical && "text-amber-500"
                  )}
                  onClick={toggleCritical}
                >
                  <Star size={14} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <Calendar size={14} />
                </Button>
                
                {isCritical && (
                  <MeetingScheduler 
                    taskName={description}
                    buttonVariant="ghost"
                    buttonSize="icon"
                    buttonText=""
                  />
                )}
              </div>
            </div>
            
            {(dateStatus || showDatePicker) && (
              <div className="ml-1">
                {showDatePicker ? (
                  <div className="mt-2">
                    <TaskDatePicker 
                      date={parsedDueDate} 
                      onDateChange={handleDueDateChange}
                      className="h-8 text-xs"
                    />
                  </div>
                ) : (
                  dateStatus && parsedDueDate && (
                    <div className={cn(
                      "flex items-center text-xs mt-1",
                      dateStatus === "overdue" && "text-destructive",
                      dateStatus === "soon" && "text-amber-500",
                      dateStatus === "completed" && "text-green-500",
                    )}>
                      <Clock size={12} className="mr-1" />
                      <span>
                        {dateStatus === "overdue" && "Atrasado: "}
                        {dateStatus === "soon" && "Prazo próximo: "}
                        {format(parsedDueDate, "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
