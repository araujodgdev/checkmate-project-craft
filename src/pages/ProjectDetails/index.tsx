
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
            checklistTitle={checklist.title}
            items={checklist.checklist_items || []}
            onToggleItem={(itemId) => handleToggleItem(checklist.id, itemId)}
          />
        ))}
      </div>
    </MainLayout>
  );
}
