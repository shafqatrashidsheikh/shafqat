import { cn } from "@/lib/utils";
import type { QuickAction } from "@/lib/assistant/quick-actions";

type QuickActionsProps = {
  actions: QuickAction[];
  onSelect: (message: string) => void;
  disabled?: boolean;
  className?: string;
};

export function QuickActions({ actions, onSelect, disabled, className }: QuickActionsProps) {
  if (!actions.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.message)}
          className="gpw-assistant-chip"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
