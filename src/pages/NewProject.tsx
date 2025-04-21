import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/useProjects";
import { ProjectBasicInfoForm } from "./NewProject/ProjectBasicInfoForm";
import { ProjectTechnicalForm } from "./NewProject/ProjectTechnicalForm";
import { ProjectObjectivesForm } from "./NewProject/ProjectObjectivesForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";

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
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const { createProject } = useProjects();

  const totalSteps = 3;

  const handleTechnologyClick = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  async function generateChecklistFromAnthropic(projectDetails: Record<string, any>) {
    try {
      console.log("Enviando detalhes do projeto para a função:", JSON.stringify(projectDetails, null, 2));
      
      const { data, error } = await supabase.functions.invoke("generate-checklist-anthropic", {
        method: "POST",
        body: { project: projectDetails },
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Resposta bruta da função:", data, error);
      
      if (error || !data?.checklist) {
        console.error("Erro completo da função:", error);
        throw new Error(error?.message ?? "Erro ao gerar checklist com IA");
      }
      
      if (!Array.isArray(data.checklist)) {
        console.error("Formato de resposta inválido:", data);
        throw new Error("Formato de resposta inválido da IA");
      }
      
      return data.checklist as string[];
    } catch (err: any) {
      console.error("Erro completo:", err);
      throw new Error("Falha IA: " + (err?.message || "Desconhecido"));
    }
  }

  const handleNext = async () => {
    if (step < totalSteps) {
      if (step === 1 && !projectName) {
        toast.error("Preencha o nome do projeto");
        return;
      }
      
      if (step === 1 && !projectType) {
        toast.error("Selecione um tipo de projeto");
        return;
      }
      
      if (step === 2 && selectedTechnologies.length === 0) {
        toast.error("Selecione pelo menos uma tecnologia");
        return;
      }
      
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setLoading(true);
      try {
        const deadlineStr = deadline
          ? deadline.toISOString().split("T")[0]
          : undefined;

        if (!projectName || !projectType || selectedTechnologies.length === 0) {
          toast.error("Preencha os campos obrigatórios.");
          setLoading(false);
          return;
        }

        let generatedChecklist: string[] = [];
        try {
          const projectDetails = {
            name: projectName,
            description,
            type: projectType,
            technologies: selectedTechnologies,
            objectives,
            deadline: deadlineStr,
          };
          
          console.log("Chamando IA para gerar checklist com:", JSON.stringify(projectDetails, null, 2));
          generatedChecklist = await generateChecklistFromAnthropic(projectDetails);
          console.log("Checklist gerada:", generatedChecklist);
        } catch (err: any) {
          console.error("Erro ao gerar checklist:", err);
          toast.error("Erro ao gerar checklist automática", { description: err?.message || "Tente novamente." });
          setLoading(false);
          return;
        }

        const createdProject = await createProject.mutateAsync({
          name: projectName,
          description,
          type: projectType,
          technologies: selectedTechnologies,
          deadline: deadlineStr,
        });

        if (createdProject?.id && generatedChecklist.length > 0) {
          try {
            const { data: insertedChecklist, error: checklistError } = await supabase
              .from("checklists")
              .insert({
                project_id: createdProject.id,
                title: "Checklist inicial (gerada pela IA)",
              })
              .select()
              .maybeSingle();

            if (checklistError || !insertedChecklist) {
              throw checklistError || new Error("Erro ao criar checklist");
            }

            const checklistId = insertedChecklist.id;

            if (checklistId) {
              const itemsToInsert = generatedChecklist.map((desc, idx) => ({
                checklist_id: checklistId,
                description: desc,
                checked: false,
                order_index: idx + 1,
              }));
              if (itemsToInsert.length > 0) {
                const { error: checklistItemsError } = await supabase
                  .from("checklist_items")
                  .insert(itemsToInsert);
                if (checklistItemsError) {
                  throw checklistItemsError;
                }
              }
            }
          } catch (err: any) {
            toast.error("Checklist criada parcialmente: salve manualmente!", { description: err?.message || "Parcialmente criada." });
          }
        }

        toast.success("Projeto e checklist criados com sucesso!");

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
            {step === 1 && (
              <ProjectBasicInfoForm
                projectTypes={projectTypes}
                projectName={projectName}
                setProjectName={setProjectName}
                projectType={projectType}
                setProjectType={setProjectType}
                description={description}
                setDescription={setDescription}
              />
            )}

            {step === 2 && (
              <ProjectTechnicalForm
                technologies={technologies}
                selectedTechnologies={selectedTechnologies}
                handleTechnologyClick={handleTechnologyClick}
              />
            )}

            {step === 3 && (
              <ProjectObjectivesForm
                objectives={objectives}
                setObjectives={setObjectives}
                deadline={deadline}
                setDeadline={setDeadline}
              />
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
