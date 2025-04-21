
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  onBack: () => void;
};

export function NewProjectHeader({ onBack }: Props) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center">
      <Button
        variant="ghost"
        onClick={onBack}
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
  );
}
