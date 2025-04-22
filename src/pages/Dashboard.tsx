
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { NewProjectCard } from "@/components/dashboard/NewProjectCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { projects, isLoading, error } = useProjects();
  const [tab, setTab] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Extract unique types and technologies from projects
  const projectTypes = Array.from(new Set((projects ?? []).map(p => p.type)));
  const technologies = Array.from(new Set(
    (projects ?? []).flatMap(p => p.technologies ?? [])
  ));

  // Combined filters
  const filteredProjects = (projects ?? []).filter((project: any) => {
    // Tab filter (status)
    const matchesTab = tab === "all" || 
      (tab === "active" ? !project.completed : project.completed);
    
    // Search filter
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some((tech: string) => 
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Type filter
    const matchesType = selectedTypes.length === 0 || 
      selectedTypes.includes(project.type);

    // Technology filter
    const matchesTech = selectedTechs.length === 0 ||
      project.technologies?.some((tech: string) => 
        selectedTechs.includes(tech)
      );

    return matchesTab && matchesSearch && matchesType && matchesTech;
  });

  const renderProjectGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Carregando projetos...
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-destructive text-center py-8">
          Falha ao carregar projetos. Tente novamente.
        </div>
      );
    }
    
    if (filteredProjects && filteredProjects.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <NewProjectCard />
        </div>
      );
    }
    
    return <EmptyState />;
  };

  return (
    <MainLayout>
      <div className={cn(
        "container py-8 animate-fade-in",
        isMobile ? "pt-4" : ""
      )}>
        <DashboardHeader />

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
            <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Em Progresso</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>

              <DashboardFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedTechs={selectedTechs}
                setSelectedTechs={setSelectedTechs}
                projectTypes={projectTypes}
                technologies={technologies}
              />

              <TabsContent value="all" className="mt-6">
                {renderProjectGrid()}
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                {renderProjectGrid()}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                {renderProjectGrid()}
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
