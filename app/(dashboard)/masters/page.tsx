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
  { key: "fabric-color", label: "Color", apiPath: "/api/fabric-color" },
  { key: "party", label: "Party", apiPath: "/api/party" },
  { key: "design", label: "Design", apiPath: "/api/design", hasImage: true },
  { key: "dori", label: "Dori", apiPath: "/api/dori" },
  { key: "five-mm-seq", label: "5mm Seq", apiPath: "/api/five-mm-seq" },
  { key: "three-mm-seq", label: "3mm Seq", apiPath: "/api/three-mm-seq" },
  { key: "four-mm-beats", label: "4mm Beats", apiPath: "/api/four-mm-beats" },
  { key: "three-mm-beats", label: "3mm Beats", apiPath: "/api/three-mm-beats" },
  {
    key: "two-point-five-mm-beats",
    label: "2.5mm",
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg md:text-2xl font-semibold truncate">
          {config.label}
        </h2>
        <Button onClick={openCreate} size="sm" className="gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No items found. Create your first {config.label.toLowerCase()}.
        </div>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {config.hasImage && item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                )}
                <span className="font-medium text-sm md:text-base truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
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
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
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
              {/* Image upload commented out for now - may need in future
              {config.hasImage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Image{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {imageFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                      <span className="truncate">{imageFile.name}</span>
                    </div>
                  )}
                </div>
              )}
              */}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto"
              >
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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Masters</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your master data
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => router.push(`/masters?tab=${v}`)}
        className="space-y-4 md:space-y-6"
      >
        <TabsList className="flex flex-wrap h-auto gap-1.5 bg-transparent p-0">
          {masterConfigs.map((config) => (
            <TabsTrigger
              key={config.key}
              value={config.key}
              className="px-3 py-1.5 text-xs md:text-sm rounded-md border bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
            >
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {masterConfigs.map((config) => (
          <TabsContent key={config.key} value={config.key} className="mt-4">
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
