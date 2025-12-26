
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Truck, FileText } from "lucide-react";
import { Order } from "@/services/orders.service";
import { useMemo } from "react";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onViewTracking: (order: Order) => void;
  isLoading?: boolean;
}

import { TableSkeleton } from "@/components/ui/table-skeleton";

import { useI18n } from "@/hooks/use-i18n";

export const OrdersTable = ({ orders, onViewDetails, onViewTracking, isLoading }: OrdersTableProps) => {
  const t = useI18n();
  const table = t("orders_table") as any;

  // Export CSV
  const handleExportCSV = () => {
    const csv = [
      [
        table.header_order,
        table.header_customer,
        "Email",
        table.header_date,
        table.header_total,
        table.header_status,
        table.header_items
      ],
      ...orders.map(o =>
        [
          o.id, o.customer_name, o.customer_email, o.created_at, o.total_amount, o.status, o.items_count,
        ]
      ),
    ].map(arr => arr.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      <Button
        variant="outline"
        className="mb-2 bg-gray-800 border-gray-600 text-white hover:bg-green-700 hover:border-green-600 hover:text-white"
        onClick={handleExportCSV}
      >
        <FileText className="h-4 w-4 mr-1" /> {table.export_csv}
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-purple-300">{table.header_order}</TableHead>
            <TableHead className="text-purple-300">{table.header_customer}</TableHead>
            <TableHead className="text-purple-300 hidden md:table-cell">{table.header_date}</TableHead>
            <TableHead className="text-purple-300 hidden lg:table-cell">{table.header_items}</TableHead>
            <TableHead className="text-purple-300">{table.header_total}</TableHead>
            <TableHead className="text-purple-300">{table.header_status}</TableHead>
            <TableHead className="text-right text-purple-300">{table.header_actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <TableSkeleton columns={7} rows={5} />
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-800 transition-colors">
                <TableCell className="font-medium text-purple-100">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-purple-100">{order.customer_name}</div>
                    <div className="text-sm text-purple-400 hidden sm:block">{order.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-purple-100 hidden md:table-cell">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-purple-100 hidden lg:table-cell">{order.items_count}</TableCell>
                <TableCell className="font-medium text-purple-100">${Number(order.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      order.status === "delivered" ? "border-green-600 text-green-400 bg-green-900/20" :
                        order.status === "shipped" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
                          order.status === "processing" ? "border-yellow-600 text-yellow-400 bg-yellow-900/20" :
                            order.status === "pending" ? "border-orange-600 text-orange-400 bg-orange-900/20" : "border-red-600 text-red-400 bg-red-900/20"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-800 text-white hover:bg-purple-700 hover:text-white transition-colors"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-800 text-white hover:bg-purple-700 hover:text-white transition-colors"
                      onClick={() => onViewTracking(order)}
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
