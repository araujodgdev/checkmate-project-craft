

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
  // Largura padrão da sidebar expandida/bloqueada
  const sidebarWidth = 256;
  const sidebarCollapsedWidth = 64;

  // Poderia idealmente vir do contexto
  // Para simplificação, considerar sidebar não colapsada aqui
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        {!hideNav && <Sidebar />}
        <main
          className={cn(
            "flex-1 flex flex-col bg-background",
            "transition-all duration-300 ease-in-out",
            // Adiciona padding para não ficar embaixo da sidebar fixa
            !hideNav ? `pl-[${sidebarWidth}px]` : "",
            className
          )}
          style={{
            paddingLeft: hideNav ? undefined : `${sidebarWidth}px`
          }}
        >
          <div className="w-full flex justify-end items-center gap-4 py-4 px-4 md:px-6">
            <ThemeSwitch />
            {/* Aqui podem entrar outros botões/icons, mas o ThemeSwitch sempre à esquerda */}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
