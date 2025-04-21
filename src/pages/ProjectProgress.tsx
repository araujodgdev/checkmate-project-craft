
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle2 } from "lucide-react";

interface Project {
  name: string;
  type: string;
  technologies: string[] | null;
  deadline: string | null;
  created_at: string | null;
}

interface ProjectProgressProps {
  project: Project;
  checklists: any[];
}

export function ProjectProgress({ project, checklists }: ProjectProgressProps) {
  // Calcula estatísticas para o projeto
  const allItems = checklists?.flatMap(c => c.checklist_items || []) || [];
  const completedItems = allItems.filter(item => item.checked);
  const totalItems = allItems.length;
  const completedProgress = totalItems > 0 ? Math.round(completedItems.length / totalItems * 100) : 0;
  const completedChecklists = checklists?.filter(c => {
    const items = c.checklist_items || [];
    return items.length > 0 && items.every(item => item.checked);
  }).length || 0;

  return (
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
                  return (
                    <div key={checklist.id} className="text-sm flex items-center justify-between">
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
                    </div>
                  );
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
                    {project.technologies?.map(tech => (
                      <Badge variant="secondary" key={tech} className="mr-1 mb-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                {project.deadline && (
                  <div className="text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>Prazo: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="text-sm flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-muted-foreground" />
                  <span>Criado: {new Date(project.created_at as string).toLocaleDateString()}</span>
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
  );
}
