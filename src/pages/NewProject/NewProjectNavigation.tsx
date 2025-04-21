
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";

type Props = {
  step: number;
  totalSteps: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function NewProjectNavigation({ step, totalSteps, loading, onBack, onNext }: Props) {
  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Button onClick={onNext} disabled={loading}>
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
  );
}
