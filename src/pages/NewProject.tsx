
import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectBasicInfoForm } from "./NewProject/ProjectBasicInfoForm";
import { ProjectTechnicalForm } from "./NewProject/ProjectTechnicalForm";
import { ProjectObjectivesForm } from "./NewProject/ProjectObjectivesForm";
import { useNewProjectWizard, projectTypes, technologies } from "./NewProject/useNewProjectWizard";
import { NewProjectHeader } from "./NewProject/NewProjectHeader";
import { NewProjectProgress } from "./NewProject/NewProjectProgress";
import { NewProjectNavigation } from "./NewProject/NewProjectNavigation";

export default function NewProject() {
  const wizard = useNewProjectWizard();
  const {
    step,
    totalSteps,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    description,
    setDescription,
    selectedTechnologies,
    handleTechnologyClick,
    objectives,
    setObjectives,
    deadline,
    setDeadline,
    loading,
    handleBack,
    handleNext
  } = wizard;

  return (
    <MainLayout>
      <div className="container max-w-3xl py-8 animate-fade-in">
        <NewProjectHeader onBack={handleBack} />
        <NewProjectProgress step={step} totalSteps={totalSteps} />

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

        <NewProjectNavigation
          step={step}
          totalSteps={totalSteps}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </MainLayout>
  );
}
