
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  type: string;
  technologies: string[] | null;
  progress: number;
  deadline: string | null;
  created_at: string | null;
}

export default function PublicProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setNotFound(false);
      if (!projectId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground">Carregando projeto...</span>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <span className="text-destructive font-semibold">Projeto não encontrado ou link inválido.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2 py-8">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>
              Tipo: <span className="capitalize">{project.type}</span>
            </CardDescription>
            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span 
                    key={tech}
                    className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {project.description && (
              <div className="mb-2">
                <div className="text-sm text-muted-foreground">Descrição:</div>
                <div className="whitespace-pre-wrap">{project.description}</div>
              </div>
            )}
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Criado em:</span>{" "}
              <span>
                {project.created_at && new Date(project.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {project.deadline && (
              <div>
                <span className="text-sm text-muted-foreground">Prazo:</span>{" "}
                <span>
                  {new Date(project.deadline).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Progresso:</span>{" "}
              <span>{project.progress}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
