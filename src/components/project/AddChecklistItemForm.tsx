
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { TaskDatePicker } from "./TaskDatePicker";

interface AddChecklistItemFormProps {
  value: string;
  onChange: (value: string) => void;
  dueDate: Date | null;
  onDueDateChange: (date: Date | null) => void;
  isCritical: boolean;
  onIsCriticalChange: (value: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AddChecklistItemForm({
  value,
  onChange,
  dueDate,
  onDueDateChange,
  isCritical,
  onIsCriticalChange,
  onSubmit,
  onCancel,
  loading
}: AddChecklistItemFormProps) {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Descrição da nova tarefa"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onSubmit();
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        disabled={loading}
      />
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <TaskDatePicker
            date={dueDate || undefined}
            onDateChange={(date) => onDueDateChange(date || null)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Crítico</span>
          <Switch 
            checked={isCritical} 
            onCheckedChange={onIsCriticalChange}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex space-x-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || loading}
        >
          <Calendar size={16} className="mr-2" /> 
          Adicionar
        </Button>
      </div>
    </div>
  );
}
