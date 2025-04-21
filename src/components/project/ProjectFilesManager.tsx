
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Download, Trash2, Loader2 } from "lucide-react";
import { useProjectFiles } from "@/hooks/useProjectFiles";
import { toast } from "sonner";

interface Props {
  projectId?: string;
}

export const ProjectFilesManager: React.FC<Props> = ({ projectId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    files,
    isLoading,
    uploadFile,
    deleteFile,
    getPublicUrl,
    dir,
  } = useProjectFiles(projectId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    try {
      toast.info("Enviando arquivo...");
      await uploadFile.mutateAsync({
        file,
        path: `${dir}${file.name}`,
      });
      toast.success("Arquivo enviado com sucesso!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast.error("Falha ao enviar arquivo", { description: err.message });
    }
  };

  const handleRemove = async (name: string) => {
    if (!projectId) return;
    try {
      await deleteFile.mutateAsync(`${dir}${name}`);
      toast.success("Arquivo excluído!");
    } catch (err: any) {
      toast.error("Falha ao excluir", { description: err.message });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            Arquivos do Projeto
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadFile.isPending}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              <span>Adicionar Arquivo</span>
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="*"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando arquivos...
          </div>
        ) : (files && files.length > 0) ? (
          <ul className="space-y-3 mt-2">
            {files.map((f) => (
              <li key={f.id ?? f.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-muted-foreground" />
                  <span>{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getPublicUrl(`${dir}${f.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemove(f.name)}
                    disabled={deleteFile.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground text-sm">
            Nenhum arquivo enviado ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
