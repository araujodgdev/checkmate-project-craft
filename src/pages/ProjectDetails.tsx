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
import { useToast } from "@/hooks/use-toast"; // ajuste para o contexto correto
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

  // Nova função para acionar o compartilhamento do projeto
  const handleShareProject = async () => {
    try {
      // Só torna público se ainda não for público
      if (!project?.is_public) {
        await makePublic.mutateAsync();
        toast.success("Projeto tornado público! Link pronto para compartilhar.");
      }
      // Copia o link para a área de transferência
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao compartilhar projeto:", error);
      toast.error("Erro ao compartilhar projeto");
    }
  };

  // Exibe mensagem de carregamento
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

  // Exibe mensagem de erro
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

  // Calcula estatísticas para o projeto
  const allItems = checklists?.flatMap(c => c.checklist_items || []) || [];
  const completedItems = allItems.filter(item => item.checked);
  const totalItems = allItems.length;
  const completedProgress = totalItems > 0 ? Math.round(completedItems.length / totalItems * 100) : 0;
  const completedChecklists = checklists?.filter(c => {
    const items = c.checklist_items || [];
    return items.length > 0 && items.every(item => item.checked);
  }).length || 0;

  // Filtra checklists baseado no filtro selecionado
  const filteredChecklists = checklists?.map(checklist => ({
    ...checklist,
    checklist_items: (checklist.checklist_items || []).filter(item => {
      if (filter === "all") return true;
      if (filter === "incomplete") return !item.checked;
      if (filter === "completed") return item.checked;
      return true;
    })
  })) || [];
  return <MainLayout>
      <div className="container py-8 animate-fade-in">
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
              
              {/* Substitui botão de exportar pelo de compartilhar */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleShareProject}
                disabled={makePublic.isPending} // desativa enquanto processando
                title="Compartilhar projeto"
              >
                <Share size={16} />
                <span className="hidden md:inline">
                  {project?.is_public ? "Compartilhar" : "Tornar público & copiar link"}
                </span>
              </Button>

              {/* Mostra o link para cópia manual se já for público */}
              {project?.is_public && (
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

              {/* ... mantém botões de editar e excluir projeto */}
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
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                Progresso do Projeto
                <Badge variant="outline" className="ml-2 font-normal">
                  {completedItems.length}/{totalItems} Tarefas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso Geral</span>
                  <span className="font-medium">{completedProgress}%</span>
                </div>
                <Progress value={completedProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Categorias</h3>
                  <div className="space-y-3">
                    {checklists?.map(checklist => {
                    const items = checklist.checklist_items || [];
                    const completedCount = items.filter(item => item.checked).length;
                    const progress = items.length > 0 ? Math.round(completedCount / items.length * 100) : 0;
                    return <div key={checklist.id} className="text-sm flex items-center justify-between">
                          <span>{checklist.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {progress}%
                            </span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{
                            width: `${progress}%`
                          }} />
                            </div>
                          </div>
                        </div>;
                  })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Detalhes do Projeto</h3>
                  <div className="space-y-3">
                    <div className="text-sm flex items-center gap-2">
                      <Badge variant="outline">{project.type}</Badge>
                    </div>
                    
                    <div className="text-sm flex items-start gap-2">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.map(tech => <Badge variant="secondary" key={tech} className="mr-1 mb-1">
                            {tech}
                          </Badge>)}
                      </div>
                    </div>
                    
                    {project.deadline && <div className="text-sm flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Prazo: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>}

                    <div className="text-sm flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-muted-foreground" />
                      <span>Criado: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resumo das Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {completedItems.length}
                    </div>
                    <div className="text-sm">
                      <div>Tarefas Concluídas</div>
                      <div className="text-muted-foreground">Bom trabalho!</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                      {totalItems - completedItems.length}
                    </div>
                    <div className="text-sm">
                      <div>Tarefas Restantes</div>
                      <div className="text-muted-foreground">Continue assim!</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                      {completedChecklists}
                    </div>
                    <div className="text-sm">
                      <div>Checklists Completos</div>
                      <div className="text-muted-foreground">
                        {(checklists?.length || 0) - completedChecklists} restantes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <ClipboardCheck size={16} />
                Checklists
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <SquarePen size={16} />
                Atividade
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="checklist">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Checklists do Projeto</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setOpenCategories(checklists?.map(c => c.id) || [])}>
                        Expandir Todos
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setOpenCategories([])}>
                        Recolher Todos
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter size={14} />
                        <select className="bg-transparent outline-none" value={filter} onChange={e => setFilter(e.target.value)}>
                          <option value="all">Todas Tarefas</option>
                          <option value="incomplete">Pendentes</option>
                          <option value="completed">Concluídas</option>
                        </select>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredChecklists?.map(checklist => {
                    const totalItems = checklist.checklist_items?.length || 0;
                    const completedItems = checklist.checklist_items?.filter(item => item.checked).length || 0;
                    const progress = totalItems > 0 ? Math.round(completedItems / totalItems * 100) : 0;
                    return <Collapsible key={checklist.id} open={openCategories.includes(checklist.id)} className="border rounded-md">
                          <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50" onClick={() => toggleCategory(checklist.id)}>
                              <div className="flex items-center gap-3">
                                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openCategories.includes(checklist.id) ? "transform rotate-0" : "transform rotate-[-90deg]")} />
                                <div>
                                  <h3 className="font-medium">{checklist.title}</h3>
                                  <div className="text-sm text-muted-foreground">
                                    {completedItems}/{totalItems} tarefas concluídas
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium">{progress}%</div>
                                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className={cn("h-full transition-all", progress === 100 ? "bg-success" : "bg-primary")} style={{
                                width: `${progress}%`
                              }} />
                                </div>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              <Separator className="mb-4" />
                              <div className="space-y-3">
                                {checklist.checklist_items?.map(item => <div key={item.id} className="flex items-start gap-3">
                                    <Checkbox id={item.id} checked={item.checked} onCheckedChange={checked => handleTaskChange(item.id, checked as boolean)} className="mt-0.5" />
                                    <div className="flex-1">
                                      <label htmlFor={item.id} className={cn("text-sm font-medium cursor-pointer", item.checked && "line-through text-muted-foreground")}>
                                        {item.description}
                                      </label>
                                    </div>
                                  </div>)}
                                
                                {checklist.checklist_items?.length === 0 && <div className="text-sm text-muted-foreground text-center py-2">
                                    Nenhuma tarefa encontrada para este critério
                                  </div>}
                                
                                {addingChecklistItem === checklist.id ? <div className="flex items-center gap-2 mt-4">
                                    <Input type="text" placeholder="Descrição da nova tarefa" value={newItemText} onChange={e => setNewItemText(e.target.value)} className="flex-1" />
                                    <Button size="sm" onClick={() => handleCreateItem(checklist.id)} disabled={!newItemText.trim()}>
                                      Adicionar
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setAddingChecklistItem(null)}>
                                      Cancelar
                                    </Button>
                                  </div> : <Button variant="ghost" size="sm" className="mt-3 w-full justify-start text-muted-foreground" onClick={() => setAddingChecklistItem(checklist.id)}>
                                    <Plus size={16} className="mr-2" />
                                    Adicionar tarefa
                                  </Button>}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>;
                  })}
                    
                    {filteredChecklists?.length === 0 && <div className="text-center py-8 text-muted-foreground">
                        Nenhum checklist encontrado. Crie seu primeiro checklist!
                      </div>}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          <Plus size={16} className="mr-2" />
                          Adicionar novo checklist
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar novo checklist</DialogTitle>
                          <DialogDescription>
                            Dê um título para o novo checklist e adicione tarefas a ele.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                              Título do checklist
                            </label>
                            <Input id="title" placeholder="Ex: Requisitos funcionais" value={newChecklistTitle} onChange={e => setNewChecklistTitle(e.target.value)} />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogClose>
                          <Button onClick={handleCreateChecklist} disabled={!newChecklistTitle.trim() || isAddingChecklist}>
                            {isAddingChecklist ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando...
                              </> : 'Criar checklist'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    Registro de atividades estará disponível em breve.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>;
}
