
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedTechs: string[];
  setSelectedTechs: (techs: string[]) => void;
  projectTypes: string[];
  technologies: string[];
}

export function DashboardFilters({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  selectedTechs,
  setSelectedTechs,
  projectTypes,
  technologies,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-1 md:max-w-sm items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar projetos..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Tipo de Projeto</DropdownMenuLabel>
          {projectTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={(checked) => {
                setSelectedTypes(prev => 
                  checked 
                    ? [...prev, type]
                    : prev.filter(t => t !== type)
                );
              }}
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Tecnologias</DropdownMenuLabel>
          {technologies.map((tech) => (
            <DropdownMenuCheckboxItem
              key={tech}
              checked={selectedTechs.includes(tech)}
              onCheckedChange={(checked) => {
                setSelectedTechs(prev => 
                  checked 
                    ? [...prev, tech]
                    : prev.filter(t => t !== tech)
                );
              }}
            >
              {tech}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
