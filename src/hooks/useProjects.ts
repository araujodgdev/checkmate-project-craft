
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/store";

export function useProjects() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Lista projetos do usuário autenticado
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Mutação para criar projeto
  const createProject = useMutation({
    mutationFn: async (project: {
      name: string;
      description?: string;
      type: string;
      technologies: string[];
      deadline?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");
      const { error, data } = await supabase
        .from("projects")
        .insert({
          ...project,
          user_id: user.id,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: data,
    isLoading,
    error,
    createProject,
  };
}
