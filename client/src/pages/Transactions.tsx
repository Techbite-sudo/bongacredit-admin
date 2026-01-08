import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  phone_number: string;
  amount: number;
  product_name: string;
  status: "completed" | "failed" | "pending";
  created_at: string;
  mpesa_receipt_number: string;
};

export default function Transactions() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/transactions?pageSize=100");
        if (response.data.status === "success") {
          setData(response.data.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => <div className="font-mono text-xs text-gray-500">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "mpesa_receipt_number",
      header: "M-Pesa Code",
      cell: ({ row }) => <div className="font-mono text-xs font-medium text-gray-700">{row.getValue("mpesa_receipt_number") || "N/A"}</div>,
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("phone_number")}</div>,
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("product_name") || "Unknown Product"}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer hover:text-gray-900"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </div>
        )
      },
      cell: ({ row }) => <div className="font-bold text-gray-900">KES {row.getValue("amount")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
            status === "completed" ? "bg-green-50 text-green-700 border border-green-100" : 
            status === "failed" ? "bg-red-50 text-red-700 border border-red-100" : 
            "bg-yellow-50 text-yellow-700 border border-yellow-100"
          )}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date & Time",
      cell: ({ row }) => <div className="text-xs text-gray-500">
        {format(new Date(row.getValue("created_at")), "MMM d, yyyy HH:mm")}
      </div>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting as any,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters as any,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1">View and manage all customer payments</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <Card className="modern-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search phone number..."
                value={(table.getColumn("phone_number")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("phone_number")?.setFilterValue(event.target.value)
                }
                className="pl-9 bg-white modern-input"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{data.length}</span> total transactions
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-100">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 bg-gray-50/30">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
                        <p className="text-sm">Loading transactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <div className="text-xs text-gray-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
