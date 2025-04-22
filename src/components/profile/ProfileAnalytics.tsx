import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, BarChart, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Project {
  id: string;
  name: string;
  type: string;
  technologies: string[];
  progress: number;
  completed?: boolean;
}

interface ProfileAnalyticsProps {
  projects: Project[];
}

export function ProfileAnalytics({ projects }: ProfileAnalyticsProps) {
  const isMobile = useIsMobile();
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.completed).length;
  const inProgressProjects = totalProjects - completedProjects;
  
  // Calculate average progress across all projects
  const averageProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
    : 0;

  // Get most used technologies
  const techCount = projects.reduce((acc, project) => {
    project.technologies?.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTechnologies = Object.entries(techCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1 px-2" : "md:grid-cols-2 lg:grid-cols-3 px-0"}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projetos</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">Total de projetos</p>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <div>
                <div className="font-medium">{completedProjects}</div>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </div>
              <div>
                <div className="font-medium">{inProgressProjects}</div>
                <p className="text-xs text-muted-foreground">Em progresso</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média de conclusão dos projetos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Tecnologias</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTechnologies.map(([tech, count]) => (
              <div key={tech} className="flex justify-between items-center">
                <span className="text-sm font-medium">{tech}</span>
                <span className="text-sm text-muted-foreground">
                  {count} {count === 1 ? 'projeto' : 'projetos'}
                </span>
              </div>
            ))}
            {topTechnologies.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma tecnologia cadastrada ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
