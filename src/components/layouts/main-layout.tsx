
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeSwitch } from "../theme-switch";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
};

export function MainLayout({ children, className, hideNav = false }: MainLayoutProps) {
  const sidebarWidth = 256;
  const sidebarCollapsedWidth = 64;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        {!hideNav && <Sidebar />}
        <main
          className={cn(
            "flex-1 flex flex-col bg-background px-4 md:px-6 space-y-6",  // Increased padding and added vertical spacing
            "transition-all duration-300 ease-in-out",
            !hideNav ? `pl-[${sidebarWidth}px]` : "",
            className
          )}
          style={{
            paddingLeft: hideNav ? undefined : `${sidebarWidth}px`
          }}
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

