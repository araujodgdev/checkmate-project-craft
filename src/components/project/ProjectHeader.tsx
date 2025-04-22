import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PenSquare, Download, Trash2, Loader2, ChevronRight, Globe, Share2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ProjectPDFDialog } from "./ProjectPDFDialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectHeaderProps {
  project: any;
  checklists: any[];
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  isDeletingProject: boolean;
  handleDeleteProject: () => void;
  isPublicRoute: boolean;
}

export function ProjectHeader({
  project,
  checklists,
  isEditOpen,
  setIsEditOpen,
  isDeletingProject,
  handleDeleteProject,
  isPublicRoute
}: ProjectHeaderProps) {
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const togglePublicAccess = async () => {
    try {
      setIsUpdatingVisibility(true);
      const { error, data } = await supabase
        .from('projects')
        .update({ is_public: !project.is_public })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(["project", project.id], {
        ...project,
        is_public: !project.is_public
      });

      queryClient.invalidateQueries({ queryKey: ["project", project.id] });

      toast.success(project.is_public ? 
        "Projeto definido como privado" : 
        "Projeto definido como público"
      );
    } catch (error) {
      console.error('Erro ao atualizar visibilidade:', error);
      toast.error("Erro ao atualizar visibilidade do projeto");
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/projects/${project.id}/public`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span>{project.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {project.description || "Sem descrição"}
          </p>
          {!isPublicRoute && (
            <div className="flex items-center gap-2 mt-3">
              <Globe size={16} className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Switch
                  checked={project.is_public}
                  onCheckedChange={togglePublicAccess}
                  disabled={isUpdatingVisibility}
                />
                <span className="text-sm text-muted-foreground">
                  {project.is_public ? "Projeto público" : "Projeto privado"}
                </span>
                {project.is_public && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 ml-2"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </Button>
                )}
              </div>
            </div>
          )}
          {isPublicRoute && (
            <div className="mt-3 flex items-center gap-2">
              <Globe size={16} className="text-green-500" />
              <span className="text-sm text-muted-foreground">Visualização pública</span>
            </div>
          )}
        </div>
        
        {!isPublicRoute && (
          <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditOpen(true)}>
              <PenSquare size={16} />
              <span className="hidden md:inline">Editar Projeto</span>
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPDFOpen(true)}>
              <Download size={16} />
              <span className="hidden md:inline">Exportar</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 size={16} />
                  <span className="hidden md:inline">Excluir</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente seu projeto
                    e todos os checklists associados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteProject} disabled={isDeletingProject}>
                    {isDeletingProject ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </> : 'Excluir Projeto'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        
        {isPublicRoute && (
          <div className="mt-4 lg:mt-0">
            <Button variant="outline" size="sm" onClick={() => setIsPDFOpen(true)} className="gap-2">
              <Download size={16} />
              <span>Exportar PDF</span>
            </Button>
          </div>
        )}
      </div>

      <ProjectPDFDialog
        open={isPDFOpen}
        onOpenChange={setIsPDFOpen}
        project={project}
        checklists={checklists}
      />
    </header>
  );
}
