
import * as React from "react";
import { CalendarRange, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskDatePicker } from "./TaskDatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useChecklists } from "@/hooks/useChecklists";
import { useChecklistItems } from "@/hooks/useChecklistItems";

interface MeetingSchedulerProps {
  taskName?: string;
  projectId: string;
  buttonVariant?: "default" | "outline" | "destructive" | "secondary" | "link" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  fullWidth?: boolean;
}

export function MeetingScheduler({
  taskName,
  projectId,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonText = "Agendar Reunião",
  fullWidth = false,
}: MeetingSchedulerProps) {
  const [meetingDate, setMeetingDate] = React.useState<Date | undefined>(undefined);
  const [meetingTitle, setMeetingTitle] = React.useState<string>(
    taskName ? `Reunião: ${taskName}` : "Reunião de Acompanhamento"
  );
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const { checklists } = useChecklists(projectId);
  const { createItem } = useChecklistItems();

  const handleScheduleMeeting = async () => {
    if (!selectedChecklistId || !meetingTitle || !meetingDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      // Criar o item na checklist selecionada
      await createItem.mutateAsync({
        checklistId: selectedChecklistId,
        description: meetingTitle,
        dueDate: meetingDate,
        isCritical: true, // Reuniões são sempre críticas por padrão
      });

      // Abrir o Calendly em uma nova aba
      window.open("https://calendly.com/", "_blank");
      
      toast.success("Reunião agendada e item adicionado à checklist com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar item de reunião:", error);
      toast.error("Erro ao agendar reunião. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (taskName && open) {
      setMeetingTitle(`Reunião: ${taskName}`);
    }
  }, [taskName, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className={`gap-2 ${fullWidth ? "w-full" : ""}`}
        >
          <CalendarRange size={16} />
          <span>{buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Reunião</DialogTitle>
          <DialogDescription>
            Selecione uma checklist e configure os detalhes da reunião.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="checklist" className="text-right">
              Checklist
            </Label>
            <Select
              value={selectedChecklistId}
              onValueChange={setSelectedChecklistId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma checklist" />
              </SelectTrigger>
              <SelectContent>
                {checklists?.map((checklist) => (
                  <SelectItem key={checklist.id} value={checklist.id}>
                    {checklist.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <div className="col-span-3">
              <TaskDatePicker 
                date={meetingDate} 
                onDateChange={setMeetingDate} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            onClick={handleScheduleMeeting}
            disabled={isLoading || !selectedChecklistId || !meetingTitle || !meetingDate}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agendando...
              </>
            ) : (
              "Agendar Reunião"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
