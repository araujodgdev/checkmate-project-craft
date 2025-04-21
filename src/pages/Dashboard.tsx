
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    type: "Web",
    progress: 65,
    technologies: ["React", "Node.js", "MongoDB"],
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    name: "Mobile Banking App",
    type: "Mobile",
    progress: 32,
    technologies: ["React Native", "Firebase"],
    createdAt: "2023-11-02",
  },
  {
    id: "3",
    name: "Content Management System",
    type: "Web",
    progress: 89,
    technologies: ["Vue", "Express", "PostgreSQL"],
    createdAt: "2023-09-28",
  },
  {
    id: "4",
    name: "Task Management API",
    type: "Backend",
    progress: 45,
    technologies: ["FastAPI", "SQLAlchemy", "PostgreSQL"],
    createdAt: "2023-10-30",
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="container py-8 animate-fade-in">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your development projects and track your progress.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/new-project">
                <Button className="hidden md:flex gap-2 animate-scale-in">
                  <Plus size={18} />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-1 md:max-w-sm items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8 bg-background"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
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
                      {project.technologies.map((tech) => (
                        <Badge variant="secondary" key={tech}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground pt-1">
                    Created on {new Date(project.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              </Link>
            ))}

            <Link to="/new-project" className="block">
              <Card className="border-dashed h-full flex flex-col items-center justify-center p-6 transition-colors hover:border-primary/50 hover:bg-primary/5">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-primary" />
                </div>
                <p className="font-medium text-primary">New Project</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Create a new project and generate a checklist
                </p>
              </Card>
            </Link>
          </div>
        </TabsContent>
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
