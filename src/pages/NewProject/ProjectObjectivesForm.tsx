
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  objectives: string;
  setObjectives: (v: string) => void;
  deadline: Date | undefined;
  setDeadline: (date?: Date) => void;
};

export function ProjectObjectivesForm({
  objectives,
  setObjectives,
  deadline,
  setDeadline,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Objectives & Timeline</h2>
        <Separator className="mb-6" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="objectives">Project Objectives</Label>
          <Textarea
            id="objectives"
            placeholder="What are the main goals of this project?"
            rows={4}
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Project Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !deadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
