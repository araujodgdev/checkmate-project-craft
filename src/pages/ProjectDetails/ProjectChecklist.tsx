
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type ChecklistItem = {
  id: string;
  description: string;
  checked: boolean;
};

type ProjectChecklistProps = {
  checklistTitle: string;
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
};

export function ProjectChecklist({ checklistTitle, items, onToggleItem }: ProjectChecklistProps) {
  return (
    <section className="mb-6 bg-card rounded-lg p-4 border shadow-sm">
      <h3 className="text-xl font-medium mb-4 pb-2 border-b">{checklistTitle}</h3>
      <ul className="space-y-3">
        {items.map(({ id, description, checked }) => (
          <li key={id} className="flex items-start gap-3 group">
            <Checkbox
              id={`item-${id}`}
              checked={checked}
              onCheckedChange={() => onToggleItem(id)}
              className="mt-1"
            />
            <label 
              htmlFor={`item-${id}`}
              className={cn(
                "flex-1 cursor-pointer transition-colors",
                checked ? "line-through text-muted-foreground" : ""
              )}
            >
              {description}
            </label>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-muted-foreground italic">Nenhum item neste checklist.</li>
        )}
      </ul>
    </section>
  );
}
