
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function NewProjectCard() {
  return (
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
  );
}
