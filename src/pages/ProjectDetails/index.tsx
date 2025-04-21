
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectProgress } from "./ProjectProgress";
import { ProjectChecklist } from "./ProjectChecklist";
import { useProject } from "@/hooks/useProject";

export default function ProjectDetails() {
  const { project, checklists: initialChecklists, isLoading, error } = useProject();
  const [checklists, setChecklists] = useState(initialChecklists || []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !project) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            Não foi possível carregar os dados do projeto.
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalTasks = checklists.reduce((acc, checklist) => acc + (checklist.checklist_items?.length || 0), 0);
  const completedTasks = checklists.reduce(
    (acc, checklist) => acc + ((checklist.checklist_items || []).filter(item => item.checked).length || 0),
    0
  );
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleToggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist => {
        if (checklist.id !== checklistId) return checklist;
        return {
          ...checklist,
          checklist_items: (checklist.checklist_items || []).map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <ProjectHeader 
          projectName={project.name} 
          projectDescription={project.description} 
        />
        <ProjectProgress 
          progressPercentage={progressPercentage} 
          completedTasks={completedTasks} 
          totalTasks={totalTasks} 
        />
        
        <div className="grid gap-6">
          {checklists.map((checklist) => (
            <ProjectChecklist
              key={checklist.id}
              checklistTitle={checklist.title}
              items={checklist.checklist_items || []}
              onToggleItem={(itemId) => handleToggleItem(checklist.id, itemId)}
            />
          ))}
          
          {checklists.length === 0 && (
            <div className="text-center p-8 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">Este projeto ainda não possui checklists.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
