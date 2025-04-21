
import React from "react";

type ProjectProgressProps = {
  progressPercentage: number;
  completedTasks: number;
  totalTasks: number;
};

export function ProjectProgress({ progressPercentage, completedTasks, totalTasks }: ProjectProgressProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div
          className="bg-primary h-4 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-sm mt-1 text-muted-foreground">
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </section>
  );
}
