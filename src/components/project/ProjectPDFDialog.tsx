
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectPDF } from "./ProjectPDFExport";
import { PDFViewer } from '@react-pdf/renderer';

interface ProjectPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  checklists: any[];
}

export function ProjectPDFDialog({
  open,
  onOpenChange,
  project,
  checklists,
}: ProjectPDFDialogProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg h-[80vh]">
        <PDFViewer width="100%" height="100%" className="rounded-lg">
          <ProjectPDF project={project} checklists={checklists} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
}
