import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { projects, isLoading, error } = useProjects();

  return (
    <MainLayout>
      <div className="container py-8 animate-fade-in">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus projetos de desenvolvimento e acompanhe seu progresso.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/new-project">
                <Button className="hidden md:flex gap-2 animate-scale-in">
                  <Plus size={18} />
                  Novo Projeto
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Em Progresso</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>

              <div className="flex flex-1 md:max-w-sm items-center gap-2 mt-4 md:mt-0 md:ml-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar projetos..."
                    className="pl-8 bg-background"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter size={18} />
                </Button>
              </div>

              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Carregando projetos...
                  </div>
                ) : error ? (
                  <div className="text-destructive text-center py-8">
                    Falha ao carregar projetos. Tente novamente.
                  </div>
                ) : projects && projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                      <Link to={`/projects/${project.id}`} key={project.id} className="block group">
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
                    ))}
                    <Link to="/new-project" className="block">
                      <Card className="border-dashed h-full flex flex-col items-center justify-center p-6 transition-colors hover:border-primary/50 hover:bg-primary/5">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Plus size={24} className="text-primary" />
                        </div>
                        <p className="font-medium text-primary">Novo Projeto</p>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Crie um novo projeto e gere um checklist
                        </p>
                      </Card>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    Nenhum projeto encontrado. Crie seu primeiro projeto!
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active">
                <div className="py-4">
                  <p className="text-muted-foreground">Exibindo projetos em andamento.</p>
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="py-4">
                  <p className="text-muted-foreground">Exibindo projetos concluídos.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link to="/new-project">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus size={24} />
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
