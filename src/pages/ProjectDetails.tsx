import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck, Download, Filter, PenSquare, RefreshCw, SquarePen, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/useProject";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Share, Link as LinkIcon, Copy } from "lucide-react";
import { useShareProject } from "@/hooks/useShareProject";
import { useToast } from "@/hooks/use-toast";
import { ProjectDetailsHeader } from "./ProjectDetailsHeader";
import { ProjectProgress } from "./ProjectProgress";
import { ProjectChecklists } from "./ProjectChecklists";

export default function ProjectDetails() {
  const {
    projectId
  } = useParams<{
    projectId: string;
  }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, incomplete, completed
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [addingChecklistItem, setAddingChecklistItem] = useState<string | null>(null);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const {
    project,
    isLoading,
    error,
    checklists,
    updateProject,
    deleteProject,
    createChecklist,
    deleteChecklist
  } = useProject(projectId);
  const {
    createItem,
    toggleItemStatus,
    deleteItem
  } = useChecklistItems();
  const { makePublic, publicUrl } = useShareProject(projectId);

  useEffect(() => {
    // Abrir as duas primeiras categorias por padrão quando carregadas
    if (checklists && checklists.length > 0 && openCategories.length === 0) {
      const initialOpenCategories = checklists.slice(0, 2).map(checklist => checklist.id);
      setOpenCategories(initialOpenCategories);
    }
  }, [checklists]);

  const toggleCategory = (categoryId: string) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  const handleTaskChange = async (taskId: string, checked: boolean) => {
    try {
      await toggleItemStatus.mutateAsync({
        id: taskId,
        checked
      });
    } catch (error) {
      console.error("Erro ao alterar status da tarefa:", error);
      toast.error("Erro ao alterar status da tarefa");
    }
  };

  const handleCreateChecklist = async () => {
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

  const handleShareProject = async () => {
    try {
      if (!project?.is_public) {
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

  if (isLoading) {
    return <MainLayout>
        <div className="container py-8 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando detalhes do projeto...</p>
          </div>
        </div>
      </MainLayout>;
  }

  if (error || !project) {
    return <MainLayout>
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
      </MainLayout>;
  }

  const allItems = checklists?.flatMap(c => c.checklist_items || []) || [];
  const completedItems = allItems.filter(item => item.checked);
  const totalItems = allItems.length;
  const completedProgress = totalItems > 0 ? Math.round(completedItems.length / totalItems * 100) : 0;
  const completedChecklists = checklists?.filter(c => {
    const items = c.checklist_items || [];
    return items.length > 0 && items.every(item => item.checked);
  }).length || 0;

  const filteredChecklists = checklists?.map(checklist => ({
    ...checklist,
    checklist_items: (checklist.checklist_items || []).filter(item => {
      if (filter === "all") return true;
      if (filter === "incomplete") return !item.checked;
      if (filter === "completed") return item.checked;
      return true;
    })
  })) || [];

  return (
    <MainLayout>
      <div className="container py-8 animate-fade-in">
        <ProjectDetailsHeader
          project={project}
          error={error}
          isLoading={isLoading}
          isDeletingProject={isDeletingProject}
          onDeleteProject={handleDeleteProject}
          makePublic={makePublic}
          publicUrl={publicUrl}
          toast={toast}
          navigate={navigate}
        />
        <ProjectProgress project={project} checklists={checklists} />
        <ProjectChecklists
          checklists={checklists || []}
          filter={filter}
          setFilter={setFilter}
          openCategories={openCategories}
          setOpenCategories={setOpenCategories}
          newChecklistTitle={newChecklistTitle}
          setNewChecklistTitle={setNewChecklistTitle}
          newItemText={newItemText}
          setNewItemText={setNewItemText}
          addingChecklistItem={addingChecklistItem}
          setAddingChecklistItem={setAddingChecklistItem}
          isAddingChecklist={isAddingChecklist}
          handleTaskChange={handleTaskChange}
          handleCreateChecklist={handleCreateChecklist}
          handleCreateItem={handleCreateItem}
        />
      </div>
    </MainLayout>
  );
}
