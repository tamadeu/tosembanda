import { Badge } from "@/components/ui/badge";
import { Label } from "./ui/label";

interface MultiSelectBadgesProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export const MultiSelectBadges = ({ label, options, selected, onToggle }: MultiSelectBadgesProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            variant={selected.includes(option) ? "default" : "outline"}
            className="cursor-pointer text-sm"
            onClick={() => onToggle(option)}
          >
            {option}
          </Badge>
        ))}
      </div>
    </div>
  );
};