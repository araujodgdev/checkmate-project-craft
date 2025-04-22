
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus projetos de desenvolvimento e acompanhe seu progresso.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/new-project">
            <Button className="hidden md:flex gap-2 animate-scale-in">
              <Plus size={18} />
              Novo Projeto
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
