
import React from "react";

type ProjectHeaderProps = {
  projectName: string;
  projectDescription?: string;
};

export function ProjectHeader({ projectName, projectDescription }: ProjectHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-4xl font-bold">{projectName}</h1>
      {projectDescription && (
        <p className="mt-2 text-muted-foreground">{projectDescription}</p>
      )}
    </header>
  );
}
