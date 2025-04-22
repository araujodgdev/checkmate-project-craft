
import * as React from "react";
import { Calendar, CalendarRange, Clock } from "lucide-react";
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

interface MeetingSchedulerProps {
  taskName?: string;
  buttonVariant?: "default" | "outline" | "destructive" | "secondary" | "link" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  fullWidth?: boolean;
}

export function MeetingScheduler({
  taskName,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonText = "Agendar Reunião",
  fullWidth = false,
}: MeetingSchedulerProps) {
  const [meetingDate, setMeetingDate] = React.useState<Date | undefined>(undefined);
  const [meetingTitle, setMeetingTitle] = React.useState<string>(
    taskName ? `Reunião: ${taskName}` : "Reunião de Acompanhamento"
  );
  const [participantsEmail, setParticipantsEmail] = React.useState<string>("");
  const [meetingDuration, setMeetingDuration] = React.useState<string>("30");
  const [open, setOpen] = React.useState(false);

  const handleScheduleMeeting = () => {
    // Aqui integraríamos com a API do Calendly ou Google Calendar
    // Por enquanto, apenas simulamos a operação com um link e toast
    
    const calendarUrl = "https://calendly.com/";
    
    toast.success("Reunião agendada com sucesso!");
    window.open(calendarUrl, "_blank");
    setOpen(false);
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
            Configure os detalhes para agendar uma reunião de acompanhamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duração
            </Label>
            <Select 
              value={meetingDuration} 
              onValueChange={setMeetingDuration}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participants" className="text-right">
              Participantes
            </Label>
            <Input
              id="participants"
              placeholder="email@exemplo.com, outro@exemplo.com"
              value={participantsEmail}
              onChange={(e) => setParticipantsEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            onClick={handleScheduleMeeting}
            disabled={!meetingDate || !meetingTitle}
          >
            Agendar no Calendly
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
