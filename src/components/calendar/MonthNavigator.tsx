import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthNavigatorProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

const MonthNavigator = ({ currentMonth, onPrev, onNext }: MonthNavigatorProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="text-xl font-display font-semibold text-foreground">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full">
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MonthNavigator;
