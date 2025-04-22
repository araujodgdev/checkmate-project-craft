
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProject } from "./useProject";

export function useProjectState(projectId: string | undefined) {
  const navigate = useNavigate();
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
    isPublicRoute,
    createChecklist
  } = useProject(projectId);

  const handleDeleteProject = async () => {
    if (isPublicRoute || !projectId) return;
    
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
    if (isPublicRoute || !projectId || !project) return;
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

  return {
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
    handleEditProject,
    createChecklist
  };
}
