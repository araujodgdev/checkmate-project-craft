
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, SquarePen, Filter, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import React from "react";

interface ProjectChecklistsTabsProps {
  checklists: any[];
  filter: string;
  setFilter: (filter: string) => void;
  openCategories: string[];
  setOpenCategories: (categories: string[]) => void;
  addingChecklistItem: string | null;
  setAddingChecklistItem: (id: string | null) => void;
  newChecklistTitle: string;
  setNewChecklistTitle: (title: string) => void;
  newItemText: string;
  setNewItemText: (text: string) => void;
  createChecklist: any;
  isAddingChecklist: boolean;
  handleCreateChecklist: () => void;
  handleCreateItem: (checklistId: string) => void;
  handleTaskChange: (taskId: string, checked: boolean) => void;
  isPublicRoute?: boolean;
}

export function ProjectChecklistsTabs({
  checklists,
  filter,
  setFilter,
  openCategories,
  setOpenCategories,
  addingChecklistItem,
  setAddingChecklistItem,
  newChecklistTitle,
  setNewChecklistTitle,
  newItemText,
  setNewItemText,
  createChecklist,
  isAddingChecklist,
  handleCreateChecklist,
  handleCreateItem,
  handleTaskChange,
  isPublicRoute
}: ProjectChecklistsTabsProps) {
  const filteredChecklists = checklists?.map(checklist => ({
    ...checklist,
    checklist_items: (checklist.checklist_items || []).filter(item => {
      if (filter === "all") return true;
      if (filter === "incomplete") return !item.checked;
      if (filter === "completed") return item.checked;
      return true;
    })
  })) || [];

  return <div className="mb-6">
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
                {!isPublicRoute && (
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
                )}
                {isPublicRoute && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOpenCategories(checklists?.map(c => c.id) || [])}>
                    Expandir Todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setOpenCategories([])}>
                    Recolher Todos
                  </Button>
                </div>
                )}
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
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50" onClick={() => {
                      const alreadyOpen = openCategories.includes(checklist.id);
                      if (alreadyOpen) {
                        setOpenCategories(openCategories.filter(id => id !== checklist.id));
                      } else {
                        setOpenCategories([...openCategories, checklist.id]);
                      }
                    }}>
                          <div className="flex items-center gap-3">
                            <svg className={cn("h-5 w-5 text-muted-foreground transition-transform", openCategories.includes(checklist.id) ? "transform rotate-0" : "transform rotate-[-90deg]")} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"></path></svg>
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
                            {checklist.checklist_items?.map((item: any) => <div key={item.id} className="flex items-center gap-3">
                                {!isPublicRoute ? (
                                  <input type="checkbox" checked={item.checked} onChange={e => handleTaskChange(item.id, e.target.checked)} className="mt-0.5" id={item.id} />
                                ) : (
                                  <div className={`w-4 h-4 border ${item.checked ? 'bg-primary border-primary' : 'border-gray-300'} rounded flex items-center justify-center`}>
                                    {item.checked && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <label htmlFor={isPublicRoute ? undefined : item.id} className={cn("text-sm font-medium", !isPublicRoute && "cursor-pointer", item.checked && "line-through text-muted-foreground")}>
                                    {item.description}
                                  </label>
                                </div>
                              </div>)}
                            {checklist.checklist_items?.length === 0 && <div className="text-sm text-muted-foreground text-center py-2">
                                Nenhuma tarefa encontrada para este critério
                              </div>}
                            {!isPublicRoute && addingChecklistItem === checklist.id ? <div className="flex items-center gap-2 mt-4">
                                <Input type="text" placeholder="Descrição da nova tarefa" value={newItemText} onChange={e => setNewItemText(e.target.value)} className="flex-1" />
                                <Button size="sm" onClick={() => handleCreateItem(checklist.id)} disabled={!newItemText.trim()}>
                                  Adicionar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setAddingChecklistItem(null)}>
                                  Cancelar
                                </Button>
                              </div> : !isPublicRoute && <Button variant="ghost" size="sm" className="mt-3 w-full justify-start text-muted-foreground" onClick={() => setAddingChecklistItem(checklist.id)}>
                                <Plus size={16} className="mr-2" />
                                Adicionar tarefa
                              </Button>}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>;
              })}
                
                {filteredChecklists?.length === 0 && <div className="text-center py-8 text-muted-foreground">
                    {isPublicRoute ? "Nenhum checklist encontrado neste projeto." : "Nenhum checklist encontrado. Crie seu primeiro checklist!"}
                  </div>}
                  
                {isPublicRoute ? null : <Dialog>
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
                </Dialog>}
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
    </div>;
}
