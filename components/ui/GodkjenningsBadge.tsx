import { GodkjenningsStatus } from "@/lib/types";
import { godkjenningsStatusTekst, godkjenningsStatusKlasse, cn } from "@/lib/utils";

interface Props {
  status: GodkjenningsStatus;
  className?: string;
}

export function GodkjenningsBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        godkjenningsStatusKlasse(status),
        className
      )}
    >
      {godkjenningsStatusTekst(status)}
    </span>
  );
}
