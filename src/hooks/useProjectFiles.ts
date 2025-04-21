
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProjectFiles(projectId?: string) {
  const bucket = "project-files";
  const dir = projectId ? `projects/${projectId}/` : "";

  const queryClient = useQueryClient();

  // Lista arquivos do projeto
  const { data: files, isLoading } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase.storage.from(bucket).list(dir, { limit: 100 });
      if (error) throw error;
      // Retorna arquivos ou []
      return data?.filter((f) => f.name) || [];
    },
    enabled: !!projectId,
  });

  // Upload file
  const uploadFile = useMutation({
    mutationFn: async ({ file, path }: { file: File; path: string }) => {
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  // Delete
  const deleteFile = useMutation({
    mutationFn: async (fullPath: string) => {
      const { error } = await supabase.storage.from(bucket).remove([fullPath]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  // URL para download
  const getPublicUrl = (fullPath: string) => {
    return supabase.storage.from(bucket).getPublicUrl(fullPath).data.publicUrl;
  };

  return {
    files,
    isLoading,
    uploadFile,
    deleteFile,
    getPublicUrl,
    bucket,
    dir,
  };
}
