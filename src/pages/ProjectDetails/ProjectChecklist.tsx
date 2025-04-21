
import React from "react";

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
    <section className="mb-6">
      <h3 className="text-xl font-medium mb-3">{checklistTitle}</h3>
      <ul className="space-y-2">
        {items.map(({ id, description, checked }) => (
          <li key={id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleItem(id)}
              className="cursor-pointer"
            />
            <span className={checked ? "line-through text-muted-foreground" : ""}>{description}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-muted-foreground">No items in this checklist.</li>
        )}
      </ul>
    </section>
  );
}
