"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Pencil, Trash2, Download } from "lucide-react";
import { generateOrderPDF } from "@/lib/generate-order-pdf";

type OrderDetail = {
  id: string;
  orderNumber: string;
  orderDate: string;
  partyName: { id: string; name: string };
  design: { id: string; name: string; imageUrl?: string };
  fabric: { id: string; name: string }[];
  fabricColor: { id: string; name: string }[];
  dori: { id: string; name: string }[];
  Five_mm_seq: { id: string; name: string }[];
  Three_mm_seq: { id: string; name: string }[];
  Four_mm_beats: { id: string; name: string }[];
  Three_mm_beats: { id: string; name: string }[];
  Two_point_five_mm_beats: { id: string; name: string }[];
  frame: number;
  notes: string | null;
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/order/${id}`);
      if (!res.ok) {
        toast.error("Order not found");
        router.push("/orders");
        return;
      }
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/order/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Order deleted successfully");
      router.push("/orders");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const handleDownloadPDF = async () => {
    if (!order) return;

    setDownloading(true);
    try {
      await generateOrderPDF({
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        partyName: order.partyName.name,
        designName: order.design.name,
        designImageUrl: order.design.imageUrl,
        frame: order.frame,
        notes: order.notes,
        fabric: order.fabric.map((f) => f.name),
        fabricColor: order.fabricColor.map((f) => f.name),
        dori: order.dori.map((f) => f.name),
        fiveMmSeq: order.Five_mm_seq.map((f) => f.name),
        threeMmSeq: order.Three_mm_seq.map((f) => f.name),
        fourMmBeats: order.Four_mm_beats.map((f) => f.name),
        threeMmBeats: order.Three_mm_beats.map((f) => f.name),
        twoPointFiveMmBeats: order.Two_point_five_mm_beats.map((f) => f.name),
      });
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-xl md:text-2xl font-bold truncate">
            Order #{order.orderNumber}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 sm:flex-none"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 sm:flex-none"
          >
            <Link href={`/orders/${id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Order Number
            </p>
            <p className="font-medium text-sm md:text-base">
              {order.orderNumber}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Order Date
            </p>
            <p className="font-medium text-sm md:text-base">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Party</p>
            <p className="font-medium text-sm md:text-base">
              {order.partyName.name}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Frame</p>
            <p className="font-medium text-sm md:text-base">{order.frame}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">
            Design
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            {order.design.imageUrl && (
              <img
                src={order.design.imageUrl}
                alt={order.design.name}
                className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover"
              />
            )}
            <p className="font-medium text-sm md:text-base">
              {order.design.name}
            </p>
          </div>
        </div>

        {order.notes && (
          <>
            <Separator />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                Notes
              </p>
              <p className="whitespace-pre-wrap text-sm md:text-base">
                {order.notes}
              </p>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-3 md:space-y-4">
          <p className="text-sm font-medium">Materials</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <MaterialBadges title="Fabrics" items={order.fabric} />
            <MaterialBadges title="Fabric Colors" items={order.fabricColor} />
            <MaterialBadges title="Dori" items={order.dori} />
            <MaterialBadges title="5mm Sequins" items={order.Five_mm_seq} />
            <MaterialBadges title="3mm Sequins" items={order.Three_mm_seq} />
            <MaterialBadges title="4mm Beats" items={order.Four_mm_beats} />
            <MaterialBadges title="3mm Beats" items={order.Three_mm_beats} />
            <MaterialBadges
              title="2.5mm Beats"
              items={order.Two_point_five_mm_beats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialBadges({
  title,
  items,
}: {
  title: string;
  items: { id: string; name: string }[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs md:text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Badge key={item.id} variant="secondary" className="text-xs">
            {item.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
