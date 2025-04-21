
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Home, List, Plus, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { label: "Dashboard", icon: Home, href: "/" },
    { label: "Projects", icon: List, href: "/projects" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen border-r border-border bg-sidebar flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-border">
        <Link 
          to="/"
          className={cn(
            "flex items-center gap-2 font-semibold text-sidebar-foreground transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          <CheckCircle size={24} className="flex-shrink-0 text-primary" />
          <span className={cn("transition-opacity duration-300", 
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            CheckMate
          </span>
        </Link>
        {!collapsed && <span className="flex-1" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-sidebar-foreground", !collapsed && "ml-auto")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <TooltipProvider key={item.href} delayDuration={collapsed ? 100 : 1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start mb-1",
                          isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon size={20} className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-2")} />
                        <span className={cn("transition-all duration-300", 
                          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}>
                          {item.label}
                        </span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(!collapsed && "hidden")}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <TooltipProvider delayDuration={collapsed ? 100 : 1000}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/new-project">
                <Button
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-2")} />
                  <span className={cn("transition-all duration-300", 
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    New Project
                  </span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(!collapsed && "hidden")}>
              New Project
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
