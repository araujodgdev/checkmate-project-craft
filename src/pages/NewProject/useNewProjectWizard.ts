
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/useProjects";
import { useAnthropic } from "@/hooks/useAnthropic";

export const projectTypes = [
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile Application" },
  { value: "backend", label: "Backend Service" },
  { value: "fullstack", label: "Full Stack" },
  { value: "desktop", label: "Desktop Application" },
];

export const technologies = [
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", 
  "Django", "Flask", "Ruby on Rails", "Laravel", 
  "React Native", "Flutter", "Swift", "Kotlin",
  "PostgreSQL", "MongoDB", "MySQL", "Firebase", 
  "Docker", "Kubernetes", "AWS", "Azure", "GCP",
];

export function useNewProjectWizard(totalSteps = 3) {
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
  const { generateChecklist, isLoading: isGeneratingChecklist } = useAnthropic();

  const handleTechnologyClick = (tech: string) => {
    setSelectedTechnologies(selectedTechnologies =>
      selectedTechnologies.includes(tech)
        ? selectedTechnologies.filter(t => t !== tech)
        : [...selectedTechnologies, tech]
    );
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

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

          // Aqui está a correção: chamar generateChecklist diretamente como uma função normal
          generatedChecklist = await generateChecklist(projectDetails);
        } catch (err: any) {
          toast.error("Erro ao gerar checklist automática", { 
            description: err?.message || "Tente novamente." 
          });
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
            toast.error("Checklist criada parcialmente: salve manualmente!", { 
              description: err?.message || "Parcialmente criada." 
            });
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

  return {
    step,
    setStep,
    loading,
    selectedTechnologies,
    setSelectedTechnologies,
    handleTechnologyClick,
    deadline,
    setDeadline,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    description,
    setDescription,
    objectives,
    setObjectives,
    handleBack,
    handleNext,
    totalSteps
  };
}
