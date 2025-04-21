
import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
}

export function MainLayout({ children, className, hideNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        {!hideNav && <Sidebar />}
        <main className={cn(
          "flex-1 flex flex-col bg-background",
          "transition-all duration-300 ease-in-out",
          className
        )}>
          <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
