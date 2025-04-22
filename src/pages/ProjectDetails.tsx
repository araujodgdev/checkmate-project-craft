
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectProgressCard } from "@/components/project/ProjectProgressCard";
import { ProjectSummaryCard } from "@/components/project/ProjectSummaryCard";
import { ProjectFilesManager } from "@/components/project/ProjectFilesManager";
import { ProjectEditDialog } from "@/components/project/ProjectEditDialog";
import { ProjectChecklistsTabs } from "@/components/project/ProjectChecklistsTabs";

export default function ProjectDetails() {
  const { projectId } = useParams<{projectId: string}>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, incomplete, completed
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [addingChecklistItem, setAddingChecklistItem] = useState<string | null>(null);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const {
    project,
    isLoading,
    error,
    checklists,
    updateProject,
    deleteProject,
    createChecklist,
    deleteChecklist,
    isPublicRoute
  } = useProject(projectId);

  const { 
    createItem,
    toggleItemStatus,
    deleteItem
  } = useChecklistItems();

  useEffect(() => {
    if (checklists && checklists.length > 0 && openCategories.length === 0) {
      const initialOpenCategories = checklists
        .slice(0, 2)
        .map(checklist => checklist.id);
      setOpenCategories(initialOpenCategories);
    }
  }, [checklists]);

  const handleTaskChange = async (taskId: string, checked: boolean) => {
    if (isPublicRoute) return; // Não permitir alterações em modo público
    
    try {
      await toggleItemStatus.mutateAsync({ id: taskId, checked });
    } catch (error) {
      console.error("Erro ao alterar status da tarefa:", error);
      toast.error("Erro ao alterar status da tarefa");
    }
  };

  const handleCreateChecklist = async () => {
    if (isPublicRoute) return; // Não permitir alterações em modo público
    if (!newChecklistTitle.trim() || !projectId) return;
    
    try {
      setIsAddingChecklist(true);
      await createChecklist.mutateAsync({ 
        projectId,
        title: newChecklistTitle 
      });
      setNewChecklistTitle("");
      toast.success("Checklist criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
      toast.error("Erro ao criar checklist");
    } finally {
      setIsAddingChecklist(false);
    }
  };

  const handleCreateItem = async (checklistId: string) => {
    if (isPublicRoute) return; // Não permitir alterações em modo público
    if (!newItemText.trim()) return;
    
    try {
      await createItem.mutateAsync({ 
        checklistId, 
        description: newItemText 
      });
      setNewItemText("");
      toast.success("Item adicionado ao checklist");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast.error("Erro ao adicionar item ao checklist");
    } finally {
      setAddingChecklistItem(null);
    }
  };

  const handleDeleteProject = async () => {
    if (isPublicRoute) return; // Não permitir alterações em modo público
    if (!projectId) return;
    
    try {
      setIsDeletingProject(true);
      await deleteProject.mutateAsync(projectId);
      toast.success("Projeto excluído com sucesso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      toast.error("Erro ao excluir projeto");
    } finally {
      setIsDeletingProject(false);
    }
  };

  const handleEditProject = async (values: {
    name: string;
    description: string;
    type: string;
    technologies: string[];
    deadline: string | null;
  }) => {
    if (isPublicRoute) return; // Não permitir alterações em modo público
    if (!projectId || !project) return;
    try {
      setIsEditLoading(true);
      await updateProject.mutateAsync({
        id: projectId,
        ...values,
      });
      toast.success("Projeto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Erro ao atualizar projeto");
    } finally {
      setIsEditLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando detalhes do projeto...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !project) {
    return (
      <MainLayout>
        <div className="container py-8 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-1">Erro ao carregar projeto</p>
            <p className="text-muted-foreground text-center max-w-md">
              Não foi possível carregar os detalhes deste projeto. Verifique se o projeto existe e se você tem permissão para acessá-lo.
            </p>
            <button className="mt-6 btn btn-primary" onClick={() => navigate("/dashboard")}>
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 animate-fade-in">
        <ProjectHeader
          project={project}
          checklists={checklists || []}
          isEditOpen={isEditOpen}
          setIsEditOpen={setEditOpen => isPublicRoute ? null : setIsEditOpen(setEditOpen)}
          isDeletingProject={isDeletingProject}
          handleDeleteProject={handleDeleteProject}
          navigate={navigate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
          createChecklist={createChecklist}
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
