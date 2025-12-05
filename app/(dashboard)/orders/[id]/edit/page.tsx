"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type SelectOption = { id: string; name: string; imageUrl?: string };

type OrderDetail = {
  id: string;
  orderNumber: string;
  partyId: string;
  designId: string;
  fabric: { id: string }[];
  fabricColor: { id: string }[];
  dori: { id: string }[];
  Five_mm_seq: { id: string }[];
  Three_mm_seq: { id: string }[];
  Four_mm_beats: { id: string }[];
  Three_mm_beats: { id: string }[];
  Two_point_five_mm_beats: { id: string }[];
  frame: number;
  notes: string | null;
};

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [orderNumber, setOrderNumber] = useState("");
  const [partyId, setPartyId] = useState("");
  const [designId, setDesignId] = useState("");
  const [frame, setFrame] = useState("0");
  const [notes, setNotes] = useState("");

  const [fabricIds, setFabricIds] = useState<string[]>([]);
  const [fabricColorIds, setFabricColorIds] = useState<string[]>([]);
  const [doriIds, setDoriIds] = useState<string[]>([]);
  const [fiveMmSeqIds, setFiveMmSeqIds] = useState<string[]>([]);
  const [threeMmSeqIds, setThreeMmSeqIds] = useState<string[]>([]);
  const [fourMmBeatsIds, setFourMmBeatsIds] = useState<string[]>([]);
  const [threeMmBeatsIds, setThreeMmBeatsIds] = useState<string[]>([]);
  const [twoPointFiveMmBeatsIds, setTwoPointFiveMmBeatsIds] = useState<
    string[]
  >([]);

  const [parties, setParties] = useState<SelectOption[]>([]);
  const [designs, setDesigns] = useState<SelectOption[]>([]);
  const [fabrics, setFabrics] = useState<SelectOption[]>([]);
  const [fabricColors, setFabricColors] = useState<SelectOption[]>([]);
  const [doris, setDoris] = useState<SelectOption[]>([]);
  const [fiveMmSeqs, setFiveMmSeqs] = useState<SelectOption[]>([]);
  const [threeMmSeqs, setThreeMmSeqs] = useState<SelectOption[]>([]);
  const [fourMmBeats, setFourMmBeats] = useState<SelectOption[]>([]);
  const [threeMmBeats, setThreeMmBeats] = useState<SelectOption[]>([]);
  const [twoPointFiveMmBeats, setTwoPointFiveMmBeats] = useState<
    SelectOption[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        orderRes,
        partiesRes,
        designsRes,
        fabricsRes,
        fabricColorsRes,
        dorisRes,
        fiveMmSeqsRes,
        threeMmSeqsRes,
        fourMmBeatsRes,
        threeMmBeatsRes,
        twoPointFiveMmBeatsRes,
      ] = await Promise.all([
        fetch(`/api/order/${id}`),
        fetch("/api/party"),
        fetch("/api/design"),
        fetch("/api/fabric"),
        fetch("/api/fabric-color"),
        fetch("/api/dori"),
        fetch("/api/five-mm-seq"),
        fetch("/api/three-mm-seq"),
        fetch("/api/four-mm-beats"),
        fetch("/api/three-mm-beats"),
        fetch("/api/two-point-five-mm-beats"),
      ]);

      if (!orderRes.ok) {
        toast.error("Order not found");
        router.push("/orders");
        return;
      }

      const order: OrderDetail = await orderRes.json();

      setOrderNumber(order.orderNumber);
      setPartyId(order.partyId);
      setDesignId(order.designId);
      setFrame(order.frame.toString());
      setNotes(order.notes || "");
      setFabricIds(order.fabric.map((f) => f.id));
      setFabricColorIds(order.fabricColor.map((f) => f.id));
      setDoriIds(order.dori.map((f) => f.id));
      setFiveMmSeqIds(order.Five_mm_seq.map((f) => f.id));
      setThreeMmSeqIds(order.Three_mm_seq.map((f) => f.id));
      setFourMmBeatsIds(order.Four_mm_beats.map((f) => f.id));
      setThreeMmBeatsIds(order.Three_mm_beats.map((f) => f.id));
      setTwoPointFiveMmBeatsIds(order.Two_point_five_mm_beats.map((f) => f.id));

      setParties(await partiesRes.json());
      setDesigns(await designsRes.json());
      setFabrics(await fabricsRes.json());
      setFabricColors(await fabricColorsRes.json());
      setDoris(await dorisRes.json());
      setFiveMmSeqs(await fiveMmSeqsRes.json());
      setThreeMmSeqs(await threeMmSeqsRes.json());
      setFourMmBeats(await fourMmBeatsRes.json());
      setThreeMmBeats(await threeMmBeatsRes.json());
      setTwoPointFiveMmBeats(await twoPointFiveMmBeatsRes.json());
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const toggleSelection = (
    itemId: string,
    selected: string[],
    setSelected: (ids: string[]) => void
  ) => {
    if (selected.includes(itemId)) {
      setSelected(selected.filter((i) => i !== itemId));
    } else {
      setSelected([...selected, itemId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber || !partyId || !designId) {
      toast.error("Order number, party, and design are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          partyId,
          designId,
          frame: parseInt(frame) || 0,
          notes: notes || null,
          fabricIds,
          fabricColorIds,
          doriIds,
          fiveMmSeqIds,
          threeMmSeqIds,
          fourMmBeatsIds,
          threeMmBeatsIds,
          twoPointFiveMmBeatsIds,
        }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      toast.success("Order updated successfully");
      router.push(`/orders/${id}`);
    } catch {
      toast.error("Failed to update order");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const selectedDesign = designs.find((d) => d.id === designId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/orders/${id}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Order</h1>
          <p className="text-muted-foreground mt-1">Update order details</p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Number *</label>
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frame</label>
            <Input
              type="number"
              value={frame}
              onChange={(e) => setFrame(e.target.value)}
              placeholder="Enter frame count"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Party *</label>
            <Select value={partyId} onValueChange={setPartyId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select party" />
              </SelectTrigger>
              <SelectContent>
                {parties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Design *</label>
            <Select value={designId} onValueChange={setDesignId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select design" />
              </SelectTrigger>
              <SelectContent>
                {designs.map((design) => (
                  <SelectItem key={design.id} value={design.id}>
                    <div className="flex items-center gap-2">
                      {design.imageUrl && (
                        <img
                          src={design.imageUrl}
                          alt={design.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      )}
                      {design.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedDesign?.imageUrl && (
          <div className="p-4 rounded-lg border">
            <label className="text-sm font-medium mb-2 block">
              Selected Design Preview
            </label>
            <img
              src={selectedDesign.imageUrl}
              alt={selectedDesign.name}
              className="w-48 h-48 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this order..."
            rows={3}
          />
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Materials Selection</h2>

          <MultiSelectSection
            title="Fabrics"
            items={fabrics}
            selected={fabricIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, fabricIds, setFabricIds)
            }
          />

          <MultiSelectSection
            title="Fabric Colors"
            items={fabricColors}
            selected={fabricColorIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, fabricColorIds, setFabricColorIds)
            }
          />

          <MultiSelectSection
            title="Dori"
            items={doris}
            selected={doriIds}
            onToggle={(itemId) => toggleSelection(itemId, doriIds, setDoriIds)}
          />

          <MultiSelectSection
            title="5mm Sequins"
            items={fiveMmSeqs}
            selected={fiveMmSeqIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, fiveMmSeqIds, setFiveMmSeqIds)
            }
          />

          <MultiSelectSection
            title="3mm Sequins"
            items={threeMmSeqs}
            selected={threeMmSeqIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, threeMmSeqIds, setThreeMmSeqIds)
            }
          />

          <MultiSelectSection
            title="4mm Beats"
            items={fourMmBeats}
            selected={fourMmBeatsIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, fourMmBeatsIds, setFourMmBeatsIds)
            }
          />

          <MultiSelectSection
            title="3mm Beats"
            items={threeMmBeats}
            selected={threeMmBeatsIds}
            onToggle={(itemId) =>
              toggleSelection(itemId, threeMmBeatsIds, setThreeMmBeatsIds)
            }
          />

          <MultiSelectSection
            title="2.5mm Beats"
            items={twoPointFiveMmBeats}
            selected={twoPointFiveMmBeatsIds}
            onToggle={(itemId) =>
              toggleSelection(
                itemId,
                twoPointFiveMmBeatsIds,
                setTwoPointFiveMmBeatsIds
              )
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href={`/orders/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Order
          </Button>
        </div>
      </form>
    </div>
  );
}

function MultiSelectSection({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: SelectOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{title}</label>
        <p className="text-sm text-muted-foreground">
          No {title.toLowerCase()} available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {title}{" "}
        {selected.length > 0 && (
          <span className="text-muted-foreground">
            ({selected.length} selected)
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(item.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-accent"
            }`}
          >
            <Checkbox
              checked={selected.includes(item.id)}
              onCheckedChange={() => onToggle(item.id)}
              className="hidden"
            />
            <span className="text-sm">{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
