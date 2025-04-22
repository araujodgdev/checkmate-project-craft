
import { AlertCircle } from "lucide-react";
import { MainLayout } from "../layouts/main-layout";
import { useNavigate } from "react-router-dom";

interface ProjectErrorStateProps {
  isPublicRoute: boolean;
}

export function ProjectErrorState({ isPublicRoute }: ProjectErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <MainLayout hideNav={isPublicRoute}>
      <div className="container py-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-1">Erro ao carregar projeto</p>
          <p className="text-muted-foreground text-center max-w-md">
            Não foi possível carregar os detalhes deste projeto. Verifique se o projeto existe e se você tem permissão para acessá-lo.
          </p>
          <button className="mt-6 btn btn-primary" onClick={() => navigate("/dashboard")}>
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
