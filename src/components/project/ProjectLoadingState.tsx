
import { Loader2 } from "lucide-react";
import { MainLayout } from "../layouts/main-layout";

interface ProjectLoadingStateProps {
  isPublicRoute: boolean;
}

export function ProjectLoadingState({ isPublicRoute }: ProjectLoadingStateProps) {
  return (
    <MainLayout hideNav={isPublicRoute}>
      <div className="container py-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do projeto...</p>
        </div>
      </div>
    </MainLayout>
  );
}
