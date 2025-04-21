
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectProgress } from "./ProjectProgress";
import { ProjectChecklist } from "./ProjectChecklist";
import { useProject } from "@/hooks/useProject";

export default function ProjectDetails() {
  const { project, isLoading, error } = useProject();
  const [checklists, setChecklists] = useState(project?.checklists || []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">Loading...</div>
      </MainLayout>
    );
  }

  if (error || !project) {
    return (
      <MainLayout>
        <div className="container py-8">Failed to load project data.</div>
      </MainLayout>
    );
  }

  const totalTasks = checklists.reduce((acc, checklist) => acc + checklist.items.length, 0);
  const completedTasks = checklists.reduce(
    (acc, checklist) => acc + checklist.items.filter(item => item.completed).length,
    0
  );
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleToggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist => {
        if (checklist.id !== checklistId) return checklist;
        return {
          ...checklist,
          items: checklist.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        <ProjectHeader 
          projectName={project.name} 
          projectDescription={project.description} 
        />
        <ProjectProgress 
          progressPercentage={progressPercentage} 
          completedTasks={completedTasks} 
          totalTasks={totalTasks} 
        />
        {checklists.map((checklist) => (
          <ProjectChecklist
            key={checklist.id}
            checklistTitle={checklist.name}
            items={checklist.items}
            onToggleItem={(itemId) => handleToggleItem(checklist.id, itemId)}
          />
        ))}
      </div>
    </MainLayout>
  );
}
