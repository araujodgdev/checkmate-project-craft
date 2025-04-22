
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

export function ProjectSummaryCard({ checklists }: { checklists: any[] }) {
  const isMobile = useIsMobile();
  const allItems = checklists?.flatMap(c => c.checklist_items || []) || [];
  const completedItems = allItems.filter(item => item.checked);
  const totalItems = allItems.length;
  const completedChecklists = checklists?.filter(c => {
    const items = c.checklist_items || [];
    return items.length > 0 && items.every(item => item.checked);
  }).length || 0;

  return (
    <Card className={isMobile ? "" : "ml-6"}>
      <CardHeader className="pb-3">
        <CardTitle>Resumo das Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                {completedItems.length}
              </div>
              <div className="text-sm">
                <div>Tarefas Concluídas</div>
                <div className="text-muted-foreground">Bom trabalho!</div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                {totalItems - completedItems.length}
              </div>
              <div className="text-sm">
                <div>Tarefas Restantes</div>
                <div className="text-muted-foreground">Continue assim!</div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                {completedChecklists}
              </div>
              <div className="text-sm">
                <div>Checklists Completos</div>
                <div className="text-muted-foreground">
                  {(checklists?.length || 0) - completedChecklists} restantes
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
