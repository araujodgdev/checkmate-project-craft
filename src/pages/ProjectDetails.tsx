
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layouts/main-layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChecklistsState } from "@/hooks/useChecklistsState";
import { useProjectState } from "@/hooks/useProjectState";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectProgressCard } from "@/components/project/ProjectProgressCard";
import { ProjectSummaryCard } from "@/components/project/ProjectSummaryCard";
import { ProjectFilesManager } from "@/components/project/ProjectFilesManager";
import { ProjectEditDialog } from "@/components/project/ProjectEditDialog";
import { ProjectChecklistsTabs } from "@/components/project/ProjectChecklistsTabs";
import { ProjectLoadingState } from "@/components/project/ProjectLoadingState";
import { ProjectErrorState } from "@/components/project/ProjectErrorState";

export default function ProjectDetails() {
  const { projectId } = useParams<{projectId: string}>();
  const isMobile = useIsMobile();
  
  const {
    project,
    isLoading,
    error,
    checklists,
    isPublicRoute,
    isDeletingProject,
    isEditOpen,
    setIsEditOpen,
    isEditLoading,
    handleDeleteProject,
    handleEditProject
  } = useProjectState(projectId);

  const {
    filter,
    setFilter,
    openCategories,
    setOpenCategories,
    newChecklistTitle,
    setNewChecklistTitle,
    newItemText,
    setNewItemText,
    addingChecklistItem,
    setAddingChecklistItem,
    isAddingChecklist,
    handleTaskChange,
    handleCreateChecklist,
    handleCreateItem
  } = useChecklistsState(projectId, isPublicRoute);

  useEffect(() => {
    if (checklists && checklists.length > 0 && openCategories.length === 0) {
      const initialOpenCategories = checklists
        .slice(0, 2)
        .map(checklist => checklist.id);
      setOpenCategories(initialOpenCategories);
    }
  }, [checklists]);

  if (isLoading) {
    return <ProjectLoadingState isPublicRoute={isPublicRoute} />;
  }

  if (error || !project) {
    return <ProjectErrorState isPublicRoute={isPublicRoute} />;
  }

  return (
    <MainLayout hideNav={isPublicRoute}>
      <div className={`${isMobile ? "px-1" : "container"} py-4 animate-fade-in`}>
        <ProjectHeader
          project={project}
          checklists={checklists || []}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          isDeletingProject={isDeletingProject}
          handleDeleteProject={handleDeleteProject}
          isPublicRoute={isPublicRoute}
        />

        <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-3 gap-6"} mb-6`}>
          <ProjectProgressCard project={project} checklists={checklists} />
          <ProjectSummaryCard checklists={checklists} />
        </div>

        {!isPublicRoute && <ProjectFilesManager projectId={projectId} />}

        <ProjectChecklistsTabs
          checklists={checklists}
          filter={filter}
          setFilter={setFilter}
          openCategories={openCategories}
          setOpenCategories={setOpenCategories}
          addingChecklistItem={addingChecklistItem}
          setAddingChecklistItem={setAddingChecklistItem}
          newChecklistTitle={newChecklistTitle}
          setNewChecklistTitle={setNewChecklistTitle}
          newItemText={newItemText}
          setNewItemText={setNewItemText}
          isAddingChecklist={isAddingChecklist}
          handleCreateChecklist={handleCreateChecklist}
          handleCreateItem={handleCreateItem}
          handleTaskChange={handleTaskChange}
          isPublicRoute={isPublicRoute}
        />

        {!isPublicRoute && (
          <ProjectEditDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            project={project}
            onSave={handleEditProject}
            isLoading={isEditLoading}
          />
        )}
      </div>
    </MainLayout>
  );
}
