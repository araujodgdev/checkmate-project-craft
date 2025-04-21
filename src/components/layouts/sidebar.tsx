
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, GripVertical, Home, List, LogOut, Settings, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(256); // Default width
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const minWidth = 180;
  const maxWidth = 400;
  const collapsedWidth = 64;

  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Projects", icon: List, href: "/projects" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out...");
  };

  const resize = useCallback((e: MouseEvent) => {
    if (collapsed || !sidebarRef.current) return;
    const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth));
    setWidth(newWidth);
  }, [collapsed]);

  const stopResize = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  }, [resize]);

  const startResize = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    if (collapsed) return;

    setIsDragging(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  }, [collapsed, resize, stopResize]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      startResize(e);
    }
    if (e.key === 'Escape' && isDragging) {
      stopResize();
    }
    if (isDragging) {
      if (e.key === 'ArrowRight') {
        setWidth(prev => Math.min(prev + 10, maxWidth));
      } else if (e.key === 'ArrowLeft') {
        setWidth(prev => Math.max(prev - 10, minWidth));
      }
    }
  }, [startResize, stopResize, isDragging]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resize, stopResize]);

  useEffect(() => {
    if (collapsed) {
      setWidth(collapsedWidth);
    } else if (width < minWidth) {
      setWidth(minWidth);
    }
  }, [collapsed, width]);

  useEffect(() => {
    console.log("Current sidebar width:", width);
  }, [width]);

  return (
    <>
      <div
        ref={sidebarRef}
        style={{
          width: `${width}px`,
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          position: "fixed",
          zIndex: 40,
          transition: isDragging ? "" : "width 0.3s",
        }}
        className={cn(
          "border-r border-border bg-sidebar flex flex-col overflow-x-hidden h-screen",
          collapsed && "w-16",
          isDragging ? "" : "duration-300"
        )}
      >
        {/* Sidebar content remains igual */}
        <div className="flex items-center p-4 border-b border-border min-w-0">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 font-semibold text-sidebar-foreground transition-opacity min-w-0 overflow-hidden",
              collapsed && "opacity-0"
            )}
          >
            <CheckCircle size={24} className="flex-shrink-0 text-primary" />
            <span className={cn("transition-opacity duration-300 truncate",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}>
              CheckMate
            </span>
          </Link>
          {!collapsed && <span className="flex-1" />}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="text-sidebar-foreground ml-auto flex-shrink-0"
            >
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>
        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <TooltipProvider key={item.href} delayDuration={collapsed ? 100 : 1000}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={item.href} className="block">
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full overflow-hidden",
                            collapsed ? "justify-center px-0" : "justify-start",
                            "mb-1",
                            isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <item.icon size={20} className="flex-shrink-0" />
                          {!collapsed && (
                            <span className="ml-2 transition-all duration-300 truncate">
                              {item.label}
                            </span>
                          )}
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
          <div className="flex gap-2">
            <TooltipProvider delayDuration={collapsed ? 100 : 1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/profile" className="block flex-grow">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all overflow-hidden",
                        collapsed ? "justify-center px-0" : "justify-start"
                      )}
                    >
                      <User size={20} className="flex-shrink-0" />
                      {!collapsed && (
                        <span className="ml-2 transition-all duration-300 truncate">
                          Profile
                        </span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className={cn(!collapsed && "hidden")}>
                  Profile
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!collapsed && (
              <TooltipProvider delayDuration={1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {collapsed && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center px-0 mt-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {/* Resizer handle e indicators */}
      {!collapsed && (
        <button
          type="button"
          className="fixed top-0 h-full w-4 cursor-ew-resize z-50 border-0 bg-transparent p-0 m-0 focus:outline-none"
          style={{ left: `${width - 2}px` }}
          onMouseDown={startResize}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          aria-label="Resize sidebar"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          aria-orientation="vertical"
        >
          <div
            className={cn(
              "absolute top-0 bottom-0 w-1 right-1/2 bg-border hover:bg-primary/50 transition-colors",
              isDragging && "bg-primary/50"
            )}
          />
          <div
            className="absolute h-24 w-6 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          >
            <GripVertical
              size={16}
              className={cn(
                "text-sidebar-foreground transition-opacity",
                isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"
              )}
            />
          </div>
        </button>
      )}
      {collapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="fixed left-14 top-4 h-8 w-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:bg-accent z-50"
        >
          <ChevronRight size={16} />
        </Button>
      )}
    </>
  );
}

// Atenção: este arquivo está ficando muito longo! Considere pedir refatoração em arquivos menores após os ajustes.
