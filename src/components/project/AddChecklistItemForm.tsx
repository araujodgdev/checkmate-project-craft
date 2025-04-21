
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
    <div className="flex flex-col gap-2 mt-4 md:flex-row md:gap-4 md:items-end">
      <Input
        type="text"
        placeholder="Descrição da nova tarefa"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
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
      <div className="flex items-center gap-2">
        <TaskDatePicker
          date={dueDate || undefined}
          onDateChange={onDueDateChange}
          className="h-8 text-xs w-36"
        />
        <span className="text-xs text-muted-foreground">Crítico</span>
        <Switch checked={isCritical} onCheckedChange={onIsCriticalChange} />
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim() || loading}
          className="ml-2"
        >
          <Calendar size={16} className="mr-1" /> Adicionar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
