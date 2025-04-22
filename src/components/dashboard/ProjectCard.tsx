
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    type: string;
    technologies?: string[];
    progress?: number;
    created_at?: string | null;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <Badge variant="outline">{project.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {(project.technologies ?? []).map((tech: string) => (
              <Badge variant="secondary" key={tech}>
                {tech}
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{project.progress ?? 0}%</span>
            </div>
            <Progress value={project.progress ?? 0} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground pt-1">
          Criado em{" "}
          {project.created_at
            ? new Date(project.created_at).toLocaleDateString()
            : "-"}
        </CardFooter>
      </Card>
    </Link>
  );
}
