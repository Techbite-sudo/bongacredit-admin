import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { ArrowUpDown, Download, Search } from "lucide-react";
import { useState } from "react";

type Transaction = {
  id: string;
  phone: string;
  amount: number;
  product: string;
  status: "success" | "failed" | "pending";
  date: string;
  mpesaCode: string;
};

const data: Transaction[] = [
  { id: "TXN-8923", phone: "0712***456", amount: 55, product: "1.25GB Data", status: "success", date: "2024-01-08 10:30", mpesaCode: "SB8923XJ" },
  { id: "TXN-8922", phone: "0722***789", amount: 20, product: "250MB Data", status: "success", date: "2024-01-08 10:28", mpesaCode: "SB8922XJ" },
  { id: "TXN-8921", phone: "0799***123", amount: 100, product: "Airtime", status: "failed", date: "2024-01-08 10:15", mpesaCode: "SB8921XJ" },
  { id: "TXN-8920", phone: "0755***999", amount: 55, product: "1.25GB Data", status: "success", date: "2024-01-08 10:12", mpesaCode: "SB8920XJ" },
  { id: "TXN-8919", phone: "0110***000", amount: 10, product: "200 SMS", status: "success", date: "2024-01-08 10:05", mpesaCode: "SB8919XJ" },
  { id: "TXN-8918", phone: "0712***456", amount: 55, product: "1.25GB Data", status: "success", date: "2024-01-08 09:55", mpesaCode: "SB8918XJ" },
  { id: "TXN-8917", phone: "0722***789", amount: 50, product: "1.5GB Data", status: "success", date: "2024-01-08 09:45", mpesaCode: "SB8917XJ" },
  { id: "TXN-8916", phone: "0799***123", amount: 20, product: "250MB Data", status: "pending", date: "2024-01-08 09:30", mpesaCode: "SB8916XJ" },
  { id: "TXN-8915", phone: "0755***999", amount: 55, product: "1.25GB Data", status: "success", date: "2024-01-08 09:15", mpesaCode: "SB8915XJ" },
  { id: "TXN-8914", phone: "0110***000", amount: 10, product: "200 SMS", status: "success", date: "2024-01-08 09:00", mpesaCode: "SB8914XJ" },
];

export default function Transactions() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => <div className="font-mono font-bold">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "mpesaCode",
      header: "M-Pesa Code",
      cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("mpesaCode")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => <div className="font-mono">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="font-bold">
          {row.getValue("product")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        )
      },
      cell: ({ row }) => <div className="font-black">KES {row.getValue("amount")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 border-2 border-black text-xs font-bold uppercase
            ${status === "success" ? "bg-green-100 text-green-800" : 
              status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => <div className="text-xs font-mono text-gray-500">{row.getValue("date")}</div>,
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Transactions</h1>
          <button className="brutalist-btn px-4 py-2 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <Card className="brutalist-card bg-white">
          <CardHeader className="border-b-2 border-black bg-gray-50 flex flex-row items-center justify-between">
            <CardTitle className="uppercase font-black">All Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search transactions..."
                  value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("phone")?.setFilterValue(event.target.value)
                  }
                  className="pl-8 w-[250px] brutalist-input h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-2 border-black hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-black font-black uppercase text-xs tracking-wider h-12">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-end space-x-2 p-4 border-t-2 border-black bg-gray-50">
              <button
                className="brutalist-btn px-4 py-1 text-xs disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                className="brutalist-btn px-4 py-1 text-xs disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
