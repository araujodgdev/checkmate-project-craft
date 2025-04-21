
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeSwitch } from "../theme-switch";
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
          {/* Header fixo no topo */}
          <div className="sticky top-0 z-20 w-full bg-background flex justify-end items-center gap-4 py-4 px-4 md:px-6 border-b">
            <ThemeSwitch />
            {/* Pode adicionar outros botões/icons, sempre à esquerda do ThemeSwitch */}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

