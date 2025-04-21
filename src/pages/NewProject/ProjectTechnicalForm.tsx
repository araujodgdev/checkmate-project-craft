
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  technologies: string[];
  selectedTechnologies: string[];
  handleTechnologyClick: (tech: string) => void;
};

export function ProjectTechnicalForm({
  technologies,
  selectedTechnologies,
  handleTechnologyClick,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
        <div className="mb-6 h-px w-full bg-muted" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>
              Technologies <span className="text-destructive">*</span>
            </Label>
            <span className="text-sm text-muted-foreground">
              Selected: {selectedTechnologies.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTechnologies.includes(tech)
                    ? "bg-primary"
                    : "hover:bg-primary/10"
                )}
                onClick={() => handleTechnologyClick(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="complexity">Project Complexity</Label>
          <div className="pt-4 pb-2">
            <Slider
              defaultValue={[3]}
              max={5}
              step={1}
              className="mb-2"
              aria-label="Project complexity"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Simple</span>
              <span>Moderate</span>
              <span>Complex</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-size">Team Size</Label>
          <Select defaultValue="2">
            <SelectTrigger>
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Solo (1 developer)</SelectItem>
              <SelectItem value="2">Small (2-5 developers)</SelectItem>
              <SelectItem value="3">Medium (6-10 developers)</SelectItem>
              <SelectItem value="4">Large (11+ developers)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
