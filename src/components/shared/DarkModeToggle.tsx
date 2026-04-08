import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ isDark, onToggle }: DarkModeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="absolute top-4 right-4 z-20 rounded-full bg-background/60 backdrop-blur-sm shadow-soft"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};

export default DarkModeToggle;
