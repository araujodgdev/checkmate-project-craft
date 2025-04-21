
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string | null;
  type: string;
  technologies: string[] | null;
  deadline: string | null;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSave: (values: {
    name: string;
    description: string;
    type: string;
    technologies: string[];
    deadline: string | null;
  }) => Promise<void>;
  isLoading: boolean;
};

const projectTypes = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "desktop", label: "Desktop" },
];

export const ProjectEditDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  project,
  onSave,
  isLoading,
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [type, setType] = useState(project.type);
  const [technologies, setTechnologies] = useState<string[]>(project.technologies || []);
  const [techInput, setTechInput] = useState("");
  const [deadline, setDeadline] = useState(project.deadline ? project.deadline.substring(0, 10) : "");

  // Atualize o estado ao abrir o modal, para pegar dados mais novos se necessário
  useEffect(() => {
    setName(project.name);
    setDescription(project.description || "");
    setType(project.type);
    setTechnologies(project.technologies || []);
    setDeadline(project.deadline ? project.deadline.substring(0, 10) : "");
  }, [project, open]);

  const addTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("O nome do projeto é obrigatório!");
      return;
    }
    await onSave({
      name: name.trim(),
      description: description.trim(),
      type,
      technologies,
      deadline: deadline || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="edit-proj-name">Nome</Label>
            <Input
              id="edit-proj-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do projeto"
              disabled={isLoading}
              maxLength={100}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="edit-proj-desc">Descrição</Label>
            <Input
              id="edit-proj-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrição do projeto"
              disabled={isLoading}
              maxLength={200}
            />
          </div>
          <div>
            <Label htmlFor="edit-proj-type">Tipo</Label>
            <select
              id="edit-proj-type"
              className="w-full border rounded px-2 py-2 text-sm"
              value={type}
              onChange={e => setType(e.target.value)}
              disabled={isLoading}
            >
              {projectTypes.map(pt => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Tecnologias</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {technologies.map(tech => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTech(tech)}
                  title="Remover tecnologia"
                >
                  {tech} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Adicione tecnologia e pressione Enter"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={addTech}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="edit-proj-deadline">Prazo final</Label>
            <Input
              id="edit-proj-deadline"
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            loading={isLoading ? 1 : 0}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
