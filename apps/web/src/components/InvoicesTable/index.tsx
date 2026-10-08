import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { PaginationBar } from "@/components/PaginationBar";
import type { Invoice } from "@shared/lib/types";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency, getBadgeVariant } from "@/lib/utils";
import { calculateTotalAmount } from "@shared/utils/util";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { SkeletonTable } from "@/components/Skeleton";

interface InvoicesTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => Promise<void> | void;
  meta?: { total: number; page: number; size: number; totalPages: number } | null;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

const invoiceSkeletonColumns = [
  { lines: ["h-4 w-28"] },
  { className: "hidden md:table-cell", lines: ["h-3 w-24"] },
  { className: "hidden lg:table-cell", lines: ["h-3 w-24"] },
  { lines: ["h-3 w-28"] },
  { lines: ["h-3 w-16"] },
  { className: "text-right", isAction: true },
];

export default function InvoicesTable({
  invoices,
  onDelete,
  meta = null,
  onPageChange,
  onSizeChange,
  isLoading = false,
}: InvoicesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { doDELETE } = useFetch();

  const handleDelete = async () => {
    if (deleteId && clientId) {
      try {
        const response = await doDELETE(`/api/v1/invoice/clients/${clientId}/invoices/${deleteId}/delete`);
        if (response instanceof Error) throw response;

        if (!response.ok) throw new Error("An error occurred while deleting the invoice");

        await onDelete(deleteId);
        toast.success("Invoice Deleted");
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        console.log(error);
      } finally {
        setDeleteId(null);
        setClientId(null);
      }
    }
  };

  const handleNavigate = (clientId: string, invoiceId: string) => {
    navigate({ to: `/clients/${clientId}/invoices/${invoiceId}` });
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable columns={invoiceSkeletonColumns} />
      ) : (
        <>
          <div className="border border-black/10">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/10 hover:bg-transparent">
                  <TableHead className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                    Invoice
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                    Date
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                    Due Date
                  </TableHead>
                  <TableHead className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                    Status
                  </TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices && (
                  <>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-neutral-500">
                          No invoices found. Create your first invoice to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => (
                        <TableRow key={invoice.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleNavigate(invoice.clientId, invoice.id)}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-black">{invoice.invoiceNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell
                            className="hidden md:table-cell text-sm cursor-pointer text-neutral-500"
                            onClick={() => handleNavigate(invoice.clientId, invoice.id)}
                          >
                            {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell
                            className="hidden lg:table-cell text-sm cursor-pointer text-neutral-500"
                            onClick={() => handleNavigate(invoice.clientId, invoice.id)}
                          >
                            {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell
                            className="font-bold cursor-pointer text-black tabular-nums"
                            onClick={() => handleNavigate(invoice.clientId, invoice.id)}
                          >
                            {formatCurrency(
                              calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                              invoice.currency,
                            )}
                          </TableCell>
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleNavigate(invoice.clientId, invoice.id)}
                          >
                            <Badge className={`capitalize ${getBadgeVariant(invoice.status)} rounded-none border-0`}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                                <span className="sr-only">Open menu</span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 border-black/10">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate({
                                      to: "/clients/$clientId/invoices/$invoiceId",
                                      params: { invoiceId: invoice.id.toString(), clientId: invoice.clientId },
                                    })
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate({
                                      to: "/clients/$clientId/invoices/$invoiceId/edit",
                                      params: { invoiceId: invoice.id.toString(), clientId: invoice.clientId },
                                    })
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-black/10" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setClientId(invoice.clientId);
                                    setDeleteId(invoice.id);
                                  }}
                                  className="text-black"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          <PaginationBar meta={meta} onPageChange={onPageChange} onSizeChange={onSizeChange} label="invoices" />
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-black/10 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-black text-white hover:bg-black/90 rounded-none">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
