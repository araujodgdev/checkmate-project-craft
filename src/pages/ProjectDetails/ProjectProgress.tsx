
import React from "react";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck } from "lucide-react";

type ProjectProgressProps = {
  progressPercentage: number;
  completedTasks: number;
  totalTasks: number;
};

export function ProjectProgress({ progressPercentage, completedTasks, totalTasks }: ProjectProgressProps) {
  return (
    <section className="mb-8 bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Progresso do Projeto</h2>
      </div>
      
      <Progress value={progressPercentage} className="h-3 my-2" />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {completedTasks} de {totalTasks} tarefas concluídas
        </p>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
    </section>
  );
}
