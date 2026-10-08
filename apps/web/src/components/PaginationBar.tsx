import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { PaginationMeta } from "@/hooks/usePagination";

interface PaginationBarProps {
  meta: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  label: string;
}

export function PaginationBar({ meta, onPageChange, onSizeChange, label }: PaginationBarProps) {
  const start = meta && meta.total > 0 ? (meta.page - 1) * meta.size + 1 : 0;
  const end = meta ? Math.min((meta.page || 1) * (meta.size || 10), meta.total || 0) : 0;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-black/5">
      <div className="text-sm text-neutral-500 font-mono">
        {meta ? (meta.total === 0 ? `No ${label}` : `Showing ${start} - ${end} of ${meta.total}`) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!meta || meta.page <= 1}
            onClick={() => onPageChange?.(Math.max(1, (meta?.page ?? 1) - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-neutral-500 font-mono">
            {meta ? `Page ${meta.page} of ${meta.totalPages}` : ""}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={!meta || meta.page >= (meta.totalPages || 1)}
            onClick={() => onPageChange?.(Math.min(meta?.totalPages ?? 1, (meta?.page ?? 1) + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-500 font-mono">Size</label>
          <Select
            value={String(meta?.size ?? 10)}
            onValueChange={(val) => {
              if (val == null) return;
              onSizeChange?.(parseInt(val, 10));
            }}
          >
            <SelectTrigger size="sm" aria-label="Select page size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
