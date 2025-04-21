import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";

const projectTypes = [
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile Application" },
  { value: "backend", label: "Backend Service" },
  { value: "fullstack", label: "Full Stack" },
  { value: "desktop", label: "Desktop Application" },
];

const technologies = [
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", 
  "Django", "Flask", "Ruby on Rails", "Laravel", 
  "React Native", "Flutter", "Swift", "Kotlin",
  "PostgreSQL", "MongoDB", "MySQL", "Firebase", 
  "Docker", "Kubernetes", "AWS", "Azure", "GCP",
];

export default function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const { createProject } = useProjects();

  const totalSteps = 3;

  const handleTechnologyClick = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };
  
  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setLoading(true);
      try {
        const projectName = (
          document.getElementById("project-name") as HTMLInputElement
        )?.value;
        const description = (
          document.getElementById("project-description") as HTMLTextAreaElement
        )?.value;
        const type = (
          document.querySelector("[data-state=checked]") as HTMLElement
        )?.innerText ?? "web";
        const deadlineStr = deadline
          ? deadline.toISOString().split("T")[0]
          : undefined;

        if (!projectName || !type || selectedTechnologies.length === 0) {
          toast.error("Preencha os campos obrigatórios.");
          setLoading(false);
          return;
        }

        await createProject.mutateAsync({
          name: projectName,
          description,
          type,
          technologies: selectedTechnologies,
          deadline: deadlineStr,
        });

        toast.success("Projeto criado com sucesso! Gerando checklist...");

        setLoading(false);
        navigate("/dashboard");
      } catch (err: any) {
        setLoading(false);
        toast.error("Erro ao criar projeto", {
          description: err?.message || "Tente novamente.",
        });
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-3xl py-8 animate-fade-in">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 p-0 h-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-1">
              Enter project details to generate a personalized checklist
            </p>
          </div>
        </div>

        <div className="w-full bg-muted h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-in-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        
        <Card className="shadow-sm animate-scale-in">
          <CardContent className="pt-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <Separator className="mb-6" />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name <span className="text-destructive">*</span></Label>
                    <Input id="project-name" placeholder="Enter project name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project-type">Project Type <span className="text-destructive">*</span></Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea 
                      id="project-description" 
                      placeholder="Brief description of your project (optional)"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Technical Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
                  <Separator className="mb-6" />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Technologies <span className="text-destructive">*</span></Label>
                      <span className="text-sm text-muted-foreground">
                        Selected: {selectedTechnologies.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedTechnologies.includes(tech) 
                              ? "bg-primary" 
                              : "hover:bg-primary/10"
                          )}
                          onClick={() => handleTechnologyClick(tech)}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Project Complexity</Label>
                    <div className="pt-4 pb-2">
                      <Slider 
                        defaultValue={[3]} 
                        max={5} 
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Simple</span>
                        <span>Moderate</span>
                        <span>Complex</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team-size">Team Size</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo (1 developer)</SelectItem>
                        <SelectItem value="2">Small (2-5 developers)</SelectItem>
                        <SelectItem value="3">Medium (6-10 developers)</SelectItem>
                        <SelectItem value="4">Large (11+ developers)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Objectives & Timeline */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Objectives & Timeline</h2>
                  <Separator className="mb-6" />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Project Objectives</Label>
                    <Textarea 
                      id="objectives" 
                      placeholder="What are the main goals of this project?"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Project Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deadline ? format(deadline, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={deadline}
                          onSelect={setDeadline}
                          initialFocus
                          className="pointer-events-auto"
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button onClick={handleNext} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : step < totalSteps ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Generate Checklist
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
