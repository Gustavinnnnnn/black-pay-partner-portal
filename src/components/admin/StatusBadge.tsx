import { cn } from "@/lib/utils";
import { STATUS_LABEL, type Status } from "@/lib/applications";
import { STATUS_STYLE } from "./types";

export function StatusBadge({ status }: { status: string }) {
  const s = status as Status;
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLE[s])}>
      {STATUS_LABEL[s] ?? status}
    </span>
  );
}
