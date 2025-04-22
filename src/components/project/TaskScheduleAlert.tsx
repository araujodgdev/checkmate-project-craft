
import React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Calendar, Bell, CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MeetingScheduler } from "./MeetingScheduler";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskAlertProps {
  upcomingTasks: Array<{
    id: string;
    description: string;
    due_date: string;
    checklistTitle: string;
    is_critical?: boolean;
  }>;
}

export function TaskScheduleAlert({ upcomingTasks }: TaskAlertProps) {
  if (upcomingTasks.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Agrupar tarefas por status de prazo
  const overdueCount = upcomingTasks.filter(task => 
    isBefore(new Date(task.due_date), today)
  ).length;

  const todayCount = upcomingTasks.filter(task => {
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }).length;

  const soonCount = upcomingTasks.filter(task => 
    isAfter(new Date(task.due_date), today) && 
    isBefore(new Date(task.due_date), addDays(today, 4))
  ).length;

  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <Bell className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center">
        Lembrete de tarefas
        {overdueCount > 0 && (
          <Badge variant="destructive" className="ml-2">
            {overdueCount} atrasada{overdueCount > 1 ? 's' : ''}
          </Badge>
        )}
      </AlertTitle>
      <AlertDescription className="text-amber-700">
        <div className="mt-2 space-y-2">
          {todayCount > 0 && (
            <p>Você tem <strong>{todayCount}</strong> {todayCount === 1 ? 'tarefa' : 'tarefas'} para hoje.</p>
          )}
          {soonCount > 0 && (
            <p>Você tem <strong>{soonCount}</strong> {soonCount === 1 ? 'tarefa' : 'tarefas'} nos próximos dias.</p>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-amber-600">
              {format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </div>
            <MeetingScheduler 
              buttonText="Agendar check-in" 
              buttonVariant="default"
              buttonSize="sm"
            />
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
