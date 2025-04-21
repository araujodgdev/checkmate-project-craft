
import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { Calendar, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck, Download, Filter, PenSquare, RefreshCw, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Mock data
const projectDetails = {
  id: "new-project-id",
  name: "E-commerce Platform",
  type: "Web Application",
  description: "A full-featured e-commerce platform with product listings, cart, checkout, and admin panel.",
  technologies: ["React", "Node.js", "MongoDB", "Express"],
  progress: 42,
  createdAt: "2023-10-15",
  deadline: "2023-12-31",
};

// Mock categories and tasks
const checklistCategories = [
  {
    id: "setup",
    name: "Project Setup",
    progress: 80,
    tasks: [
      { id: "task1", name: "Initialize Git repository", completed: true, priority: "low" },
      { id: "task2", name: "Set up project structure", completed: true, priority: "high" },
      { id: "task3", name: "Configure build tools", completed: true, priority: "medium" },
      { id: "task4", name: "Set up linting and code formatting", completed: true, priority: "medium" },
      { id: "task5", name: "Create README with setup instructions", completed: false, priority: "low" },
    ],
  },
  {
    id: "auth",
    name: "Authentication & Security",
    progress: 33,
    tasks: [
      { id: "task6", name: "Implement user registration", completed: true, priority: "high" },
      { id: "task7", name: "Create login functionality", completed: true, priority: "high" },
      { id: "task8", name: "Set up JWT authentication", completed: false, priority: "high" },
      { id: "task9", name: "Add password reset flow", completed: false, priority: "medium" },
      { id: "task10", name: "Implement role-based access control", completed: false, priority: "medium" },
      { id: "task11", name: "Add CSRF protection", completed: false, priority: "high" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend Development",
    progress: 40,
    tasks: [
      { id: "task12", name: "Create responsive layout", completed: true, priority: "high" },
      { id: "task13", name: "Design and implement product listing page", completed: true, priority: "high" },
      { id: "task14", name: "Build product detail page", completed: false, priority: "high" },
      { id: "task15", name: "Implement shopping cart functionality", completed: false, priority: "high" },
      { id: "task16", name: "Create checkout process", completed: false, priority: "high" },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    progress: 25,
    tasks: [
      { id: "task17", name: "Design database schema", completed: true, priority: "high" },
      { id: "task18", name: "Create API endpoints for products", completed: true, priority: "high" },
      { id: "task19", name: "Implement user management API", completed: false, priority: "medium" },
      { id: "task20", name: "Build order processing system", completed: false, priority: "high" },
      { id: "task21", name: "Add payment integration", completed: false, priority: "high" },
      { id: "task22", name: "Implement search functionality", completed: false, priority: "medium" },
      { id: "task23", name: "Create admin API endpoints", completed: false, priority: "medium" },
    ],
  },
  {
    id: "testing",
    name: "Testing",
    progress: 0,
    tasks: [
      { id: "task24", name: "Write unit tests for frontend components", completed: false, priority: "medium" },
      { id: "task25", name: "Create API integration tests", completed: false, priority: "medium" },
      { id: "task26", name: "Perform end-to-end testing", completed: false, priority: "high" },
      { id: "task27", name: "Conduct performance testing", completed: false, priority: "low" },
      { id: "task28", name: "Run security vulnerability scans", completed: false, priority: "high" },
    ],
  },
];

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [filter, setFilter] = useState("all"); // all, incomplete, completed
  const [openCategories, setOpenCategories] = useState<string[]>(["setup", "auth"]);

  const toggleCategory = (categoryId: string) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  const handleTaskChange = (taskId: string, completed: boolean) => {
    // In a real app, this would update state and persist the change
    console.log("Task", taskId, "changed to", completed);
  };

  // Calculate overall progress
  const totalTasks = checklistCategories.reduce((acc, category) => acc + category.tasks.length, 0);
  const completedTasks = checklistCategories.reduce(
    (acc, category) => acc + category.tasks.filter(task => task.completed).length, 
    0
  );
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  const filteredCategories = checklistCategories.map(category => ({
    ...category,
    tasks: category.tasks.filter(task => {
      if (filter === "all") return true;
      if (filter === "incomplete") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    }),
  }));

  return (
    <MainLayout>
      <div className="container py-8 animate-fade-in">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
                <ChevronRight size={14} />
                <Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link>
                <ChevronRight size={14} />
                <span>{projectDetails.name}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{projectDetails.name}</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                {projectDetails.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="gap-2">
                <PenSquare size={16} />
                <span className="hidden md:inline">Edit Project</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw size={16} />
                <span className="hidden md:inline">Regenerate</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                Project Progress
                <Badge variant="outline" className="ml-2 font-normal">
                  {completedTasks}/{totalTasks} Tasks
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
                  <div className="space-y-3">
                    {checklistCategories.map((category) => (
                      <div key={category.id} className="text-sm flex items-center justify-between">
                        <span>{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {category.progress}%
                          </span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${category.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div className="text-sm flex items-center gap-2">
                      <Badge variant="outline">{projectDetails.type}</Badge>
                    </div>
                    
                    <div className="text-sm flex items-start gap-2">
                      <div className="flex flex-wrap gap-1">
                        {projectDetails.technologies.map((tech) => (
                          <Badge variant="secondary" key={tech} className="mr-1 mb-1">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span>Due: {new Date(projectDetails.deadline).toLocaleDateString()}</span>
                    </div>

                    <div className="text-sm flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-muted-foreground" />
                      <span>Created: {new Date(projectDetails.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {completedTasks}
                    </div>
                    <div className="text-sm">
                      <div>Completed Tasks</div>
                      <div className="text-muted-foreground">Nice work!</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                      {totalTasks - completedTasks}
                    </div>
                    <div className="text-sm">
                      <div>Remaining Tasks</div>
                      <div className="text-muted-foreground">Keep going!</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                      {checklistCategories.filter(c => c.progress === 100).length}
                    </div>
                    <div className="text-sm">
                      <div>Completed Categories</div>
                      <div className="text-muted-foreground">
                        {checklistCategories.length - checklistCategories.filter(c => c.progress === 100).length} remaining
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
                Checklist
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <SquarePen size={16} />
                Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="checklist">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>Project Checklist</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setOpenCategories(checklistCategories.map(c => c.id))}>
                        Expand All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setOpenCategories([])}>
                        Collapse All
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter size={14} />
                        <select 
                          className="bg-transparent outline-none"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        >
                          <option value="all">All Tasks</option>
                          <option value="incomplete">Incomplete</option>
                          <option value="completed">Completed</option>
                        </select>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCategories.map((category) => (
                      <Collapsible 
                        key={category.id} 
                        open={openCategories.includes(category.id)}
                        className="border rounded-md"
                      >
                        <CollapsibleTrigger asChild>
                          <div 
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleCategory(category.id)}
                          >
                            <div className="flex items-center gap-3">
                              <ChevronDown 
                                className={cn(
                                  "h-5 w-5 text-muted-foreground transition-transform",
                                  openCategories.includes(category.id) ? "transform rotate-0" : "transform rotate-[-90deg]"
                                )}
                              />
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <div className="text-sm text-muted-foreground">
                                  {category.tasks.filter(t => t.completed).length}/{category.tasks.length} tasks completed
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-medium">{category.progress}%</div>
                              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all",
                                    category.progress === 100 ? "bg-success" : "bg-primary"
                                  )}
                                  style={{ width: `${category.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="px-4 pb-4">
                            <Separator className="mb-4" />
                            <div className="space-y-3">
                              {category.tasks.map((task) => (
                                <div key={task.id} className="flex items-start gap-3">
                                  <Checkbox 
                                    id={task.id} 
                                    checked={task.completed}
                                    onCheckedChange={(checked) => 
                                      handleTaskChange(task.id, checked as boolean)
                                    }
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={task.id}
                                      className={cn(
                                        "text-sm font-medium cursor-pointer",
                                        task.completed && "line-through text-muted-foreground"
                                      )}
                                    >
                                      {task.name}
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-xs",
                                          task.priority === "high" && "bg-destructive/10 text-destructive border-destructive/20",
                                          task.priority === "medium" && "bg-warning/10 text-warning border-warning/20",
                                          task.priority === "low" && "bg-muted text-muted-foreground"
                                        )}
                                      >
                                        {task.priority} priority
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {category.tasks.length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-2">
                                  No tasks match the current filter
                                </div>
                              )}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">
                    Activity log will be available soon.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
