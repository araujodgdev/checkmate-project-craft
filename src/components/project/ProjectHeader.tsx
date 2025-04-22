import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PenSquare, CalendarRange, Download, Trash2, Loader2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
interface ProjectHeaderProps {
  project: any;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  isDeletingProject: boolean;
  handleDeleteProject: () => void;
  navigate: (to: string) => void;
}
export function ProjectHeader({
  project,
  isEditOpen,
  setIsEditOpen,
  isDeletingProject,
  handleDeleteProject,
  navigate
}: ProjectHeaderProps) {
  return <header className="mb-8">
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
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditOpen(true)}>
            <PenSquare size={16} />
            <span className="hidden md:inline">Editar Projeto</span>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
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
      </div>
    </header>;
}