
import { useTheme } from "@/lib/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Update the dark mode state when theme changes or on system preference change
  useEffect(() => {
    const updateDarkModeState = () => {
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else if (theme === "system") {
        const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(systemIsDark);
      }
    };

    updateDarkModeState();

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        updateDarkModeState();
      }
    };
    
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full border bg-background/70 dark:bg-background/40 shadow-sm">
      <Sun className="w-4 h-4 text-yellow-400" />
      <Switch
        checked={isDarkMode}
        onCheckedChange={handleToggle}
        aria-label="Alternar modo escuro"
        className="mx-1 border-foreground/10 data-[state=checked]:bg-blue-400 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700 transition-colors"
      />
      <Moon className="w-4 h-4 text-blue-600 dark:text-blue-200" />
    </div>
  );
}
