
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeSwitch } from "../theme-switch";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
};

export function MainLayout({ children, className, hideNav = false }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {!hideNav && <Sidebar />}
        <main
          className={cn(
            "flex-1 flex flex-col bg-background",
            isMobile ? "px-2 py-2" : "px-4 md:px-6 space-y-6",
            "transition-all duration-300 ease-in-out",
            !hideNav ? "md:ml-[64px]" : "",
            className
          )}
        >
          <div className="w-full flex justify-end items-center gap-4 py-4">
            <ThemeSwitch />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
