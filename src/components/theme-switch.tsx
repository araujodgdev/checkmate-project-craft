
import { useTheme } from "@/lib/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  // O valor checked indica dark mode ativo
  const checked = theme === "dark" || (theme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const handleChange = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  return (
    <label className="flex items-center gap-1 rounded-full border bg-background/70 px-3 py-1 shadow-sm dark:bg-background/80">
      <Sun className="w-4 h-4 text-yellow-400" />
      <Switch
        checked={checked}
        onCheckedChange={handleChange}
        aria-label="Alternar modo escuro"
        className="mx-1 border-foreground/10 data-[state=checked]:bg-blue-400 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700 transition-colors"
      />
      <Moon className="w-4 h-4 text-blue-600 dark:text-blue-200" />
    </label>
  );
}
