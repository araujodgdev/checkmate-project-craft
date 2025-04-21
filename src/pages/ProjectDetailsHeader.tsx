
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare, Trash2, Loader2, ChevronRight, Share, Link as LinkIcon, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layouts/main-layout";

interface Project {
  id: string;
  name: string;
  description: string | null;
  type: string;
  technologies: string[] | null;
  deadline: string | null;
  created_at: string | null;
  is_public: boolean;
}

interface ProjectDetailsHeaderProps {
  project: Project;
  error: any;
  isLoading: boolean;
  isDeletingProject: boolean;
  onDeleteProject: () => void;
  makePublic: any;
  publicUrl: string;
  toast: any;
  navigate: ReturnType<typeof useNavigate>;
}

export function ProjectDetailsHeader({
  project,
  error,
  isLoading,
  isDeletingProject,
  onDeleteProject,
  makePublic,
  publicUrl,
  toast,
  navigate,
}: ProjectDetailsHeaderProps) {
  // Mostra erro se houver
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
            <Button className="mt-6" onClick={() => navigate("/dashboard")}>
              Voltar para o Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Compartilhar projeto e copiar link
  const handleShareProject = async () => {
    try {
      if (!project.is_public) {
        await makePublic.mutateAsync();
        toast.success("Projeto tornado público! Link pronto para compartilhar.");
      }
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao compartilhar projeto:", error);
      toast.error("Erro ao compartilhar projeto");
    }
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
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShareProject}
            disabled={makePublic.isPending}
            title="Compartilhar projeto"
          >
            <Share size={16} />
            <span className="hidden md:inline">
              {project.is_public ? "Compartilhar" : "Tornar público & copiar link"}
            </span>
          </Button>
          {project.is_public && (
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await navigator.clipboard.writeText(publicUrl);
                toast.success("Link copiado!");
              }}
              title="Copiar link público"
            >
              <LinkIcon size={16} />
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <PenSquare size={16} />
            <span className="hidden md:inline">Editar Projeto</span>
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
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente seu projeto e todos os checklists associados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={onDeleteProject} disabled={isDeletingProject}>
                  {isDeletingProject ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : 'Excluir Projeto'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
