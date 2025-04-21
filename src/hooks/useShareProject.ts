
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";

export function useShareProject(projectId?: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Mutação para tornar o projeto público
  const makePublic = useMutation({
    mutationFn: async () => {
      if (!user || !projectId) throw new Error("Usuário não autenticado ou projeto inválido");
      const { error } = await supabase
        .from("projects")
        .update({ is_public: true })
        .eq("id", projectId)
        .eq("user_id", user.id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Link público do projeto
  const publicUrl = projectId
    ? `${window.location.origin}/public/${projectId}`
    : "";

  return {
    makePublic,
    publicUrl,
  };
}
