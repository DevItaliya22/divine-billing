"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

type MasterItem = {
  id: string;
  name: string;
  createdAt: string;
  imageUrl?: string;
};

type MasterConfig = {
  key: string;
  label: string;
  apiPath: string;
  hasImage?: boolean;
};

const masterConfigs: MasterConfig[] = [
  { key: "fabric", label: "Fabric", apiPath: "/api/fabric" },
  { key: "fabric-color", label: "Fabric Color", apiPath: "/api/fabric-color" },
  { key: "party", label: "Party", apiPath: "/api/party" },
  { key: "design", label: "Design", apiPath: "/api/design", hasImage: true },
  { key: "dori", label: "Dori", apiPath: "/api/dori" },
  { key: "five-mm-seq", label: "5mm Seq", apiPath: "/api/five-mm-seq" },
  { key: "three-mm-seq", label: "3mm Seq", apiPath: "/api/three-mm-seq" },
  { key: "four-mm-beats", label: "4mm Beats", apiPath: "/api/four-mm-beats" },
  { key: "three-mm-beats", label: "3mm Beats", apiPath: "/api/three-mm-beats" },
  {
    key: "two-point-five-mm-beats",
    label: "2.5mm Beats",
    apiPath: "/api/two-point-five-mm-beats",
  },
];

function MasterSection({
  config,
  isActive,
}: {
  config: MasterConfig;
  isActive: boolean;
}) {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MasterItem | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(config.apiPath);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isActive) {
      fetchItems();
    }
  }, [isActive, config.apiPath]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (config.hasImage) {
        const formData = new FormData();
        formData.append("name", name);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const res = await fetch(
          editItem ? `${config.apiPath}/${editItem.id}` : config.apiPath,
          {
            method: editItem ? "PUT" : "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Failed to save");
      } else {
        const res = await fetch(
          editItem ? `${config.apiPath}/${editItem.id}` : config.apiPath,
          {
            method: editItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }
        );

        if (!res.ok) throw new Error("Failed to save");
      }

      toast.success(editItem ? "Updated successfully" : "Created successfully");
      setDialogOpen(false);
      setEditItem(null);
      setName("");
      setImageFile(null);
      fetchItems();
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`${config.apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Deleted successfully");
      fetchItems();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (item: MasterItem) => {
    setEditItem(item);
    setName(item.name);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setName("");
    setImageFile(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{config.label}</h2>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add {config.label}
        </Button>
      </div>

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No items found. Create your first {config.label.toLowerCase()}.
        </div>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                {config.hasImage && item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editItem ? `Edit ${config.label}` : `Add ${config.label}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${config.label.toLowerCase()} name`}
                  autoFocus
                />
              </div>
              {config.hasImage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Image{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                    {imageFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        {imageFile.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MastersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "fabric";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Masters</h1>
        <p className="text-muted-foreground mt-1">Manage your master data</p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => router.push(`/masters?tab=${v}`)}
        className="space-y-6"
      >
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
          {masterConfigs.map((config) => (
            <TabsTrigger
              key={config.key}
              value={config.key}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
            >
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {masterConfigs.map((config) => (
          <TabsContent key={config.key} value={config.key} className="mt-6">
            <MasterSection config={config} isActive={tab === config.key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function MastersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MastersContent />
    </Suspense>
  );
}
