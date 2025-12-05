"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ClipboardList,
} from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  orderDate: string;
  partyName: { name: string };
  design: { name: string; imageUrl?: string };
  frame: number;
  notes: string | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/order");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/order/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.partyName.name.toLowerCase().includes(search.toLowerCase()) ||
      order.design.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your orders
          </p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto">
          <Link href="/orders/new">
            <Plus className="w-4 h-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {search ? "No orders found matching your search" : "No orders yet"}
          </p>
          {!search && (
            <Button asChild className="mt-4">
              <Link href="/orders/new">Create your first order</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {order.design.imageUrl && (
                    <img
                      src={order.design.imageUrl}
                      alt={order.design.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.design.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/orders/${order.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(order.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Party: </span>
                  <span>{order.partyName.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Frame: </span>
                  <span>{order.frame}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
