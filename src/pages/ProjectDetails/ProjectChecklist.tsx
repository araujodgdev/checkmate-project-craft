
import React from "react";

type ChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
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
        {items.map(({ id, title, completed }) => (
          <li key={id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggleItem(id)}
              className="cursor-pointer"
            />
            <span className={completed ? "line-through text-muted-foreground" : ""}>{title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
