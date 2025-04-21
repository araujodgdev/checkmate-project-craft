
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface TaskDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function TaskDatePicker({
  date,
  onDateChange,
  disabled = false,
  className,
}: TaskDatePickerProps) {
  const handleSelect = (newDate: Date | undefined) => {
    onDateChange(newDate);
    if (newDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(newDate);
      dueDate.setHours(0, 0, 0, 0);
      
      // Se a data for próxima (menos de 3 dias)
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3 && diffDays > 0) {
        toast.info(`Lembrete: Esta tarefa vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex justify-start text-left w-full font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
          ) : (
            <span>Selecionar data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
