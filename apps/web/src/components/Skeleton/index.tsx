import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SkeletonTableColumn = {
  className?: string;
  lines?: string[];
  headerWidthClass?: string;
  isAction?: boolean;
};

type SkeletonTableProps = {
  columns?: SkeletonTableColumn[];
  rows?: number;
  showPagination?: boolean;
};

const defaultTableColumns: SkeletonTableColumn[] = [
  {
    lines: ["h-4 w-32", "h-3 w-20 sm:hidden"],
    headerWidthClass: "w-24",
  },
  {
    className: "hidden sm:table-cell",
    lines: ["h-3 w-40", "h-3 w-28"],
    headerWidthClass: "w-28",
  },
  {
    className: "hidden md:table-cell",
    lines: ["h-3 w-28", "h-3 w-16"],
    headerWidthClass: "w-20",
  },
  {
    className: "hidden lg:table-cell",
    lines: ["h-3 w-24"],
    headerWidthClass: "w-16",
  },
  {
    className: "w-12.5 text-right",
    isAction: true,
  },
];

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-4 w-1/2 mt-4" />
      </CardContent>
    </Card>
  );
}

export function SkeletonBarChart() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function SkeletonPieChart() {
  return (
    <div className="mt-4 flex justify-center items-center">
      <Skeleton className="h-56 w-56 rounded-full" />
    </div>
  );
}

export function SkeletonTable({
  columns = defaultTableColumns,
  rows = 3,
  showPagination = true,
}: SkeletonTableProps = {}) {
  const rowArray = Array.from({ length: rows });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={`skeleton-table-head-${index}`} className={column.className}>
                  {!column.isAction && <Skeleton className={`h-4 ${column.headerWidthClass ?? "w-20"}`} />}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowArray.map((_, rowIndex) => (
              <TableRow key={`skeleton-table-row-${rowIndex}`}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={`skeleton-table-cell-${rowIndex}-${columnIndex}`} className={column.className}>
                    {column.isAction ? (
                      <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {(column.lines ?? ["h-3 w-24"]).map((lineClass, lineIndex) => (
                          <Skeleton
                            key={`skeleton-table-cell-line-${rowIndex}-${columnIndex}-${lineIndex}`}
                            className={lineClass}
                          />
                        ))}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}

export function SkeletonClientInfoCard() {
  const infoRows = [
    { valueLines: ["h-4 w-56"] },
    { valueLines: ["h-4 w-40"] },
    { valueLines: ["h-4 w-56", "h-4 w-48", "h-4 w-40"] },
  ];

  return (
    <Card className="mb-8">
      <CardHeader className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {infoRows.map((row, index) => (
          <div key={`skeleton-client-info-${index}`} className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-24" />
              {row.valueLines.map((lineClass, lineIndex) => (
                <Skeleton key={`skeleton-client-info-line-${index}-${lineIndex}`} className={lineClass} />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SkeletonInvoicePage() {
  const invoiceTableColumns: SkeletonTableColumn[] = [
    { lines: ["h-4 w-40", "h-3 w-32"] },
    { className: "text-center", lines: ["h-4 w-12 mx-auto"] },
    { className: "text-right", lines: ["h-4 w-24 ml-auto"] },
    { className: "text-right", lines: ["h-4 w-28 ml-auto"] },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-24" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-2 sm:text-right">
                <Skeleton className="h-4 w-24 sm:ml-auto" />
                <Skeleton className="h-4 w-32 sm:ml-auto" />
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`invoice-items-skeleton-row-${index}`}>
                      {invoiceTableColumns.map((column, columnIndex) => (
                        <TableCell
                          key={`invoice-items-skeleton-cell-${index}-${columnIndex}`}
                          className={column.className}
                        >
                          <div className="flex flex-col gap-2">
                            {(column.lines ?? ["h-3 w-24"]).map((lineClass, lineIndex) => (
                              <Skeleton
                                key={`invoice-items-skeleton-line-${index}-${columnIndex}-${lineIndex}`}
                                className={lineClass}
                              />
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`invoice-summary-skeleton-${index}`} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t border-border">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SkeletonSubscriptionsList() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 bg-background">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </CardFooter>
    </Card>
  );
}
