import { useCallback, useMemo, useRef, useState } from "react";
import { Copy, FileText, Film, ImageIcon, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEDIA_FOLDERS, type MediaFolder } from "@/lib/media/constants";
import { defaultFolderForKind, formatByteSize, inferMediaKind } from "@/lib/media/kind";
import { replaceMediaFile, uploadMediaFile } from "@/lib/media/upload";
import type { DbMediaAsset } from "@/lib/supabase/types";
import {
  cmaCreateMediaAsset,
  cmaDeleteMediaAsset,
  cmaReplaceMediaAssetFile,
  cmaUpdateMediaAsset,
} from "@/server/cma/media";
import { fetchMediaAssets } from "@/server/cda/content";

type AdminMediaPanelProps = {
  accessToken: string;
  assets: DbMediaAsset[];
  onRefresh: () => Promise<void>;
};

const KIND_FILTERS = ["all", "image", "video", "pdf", "other"] as const;

export function AdminMediaPanel({ accessToken, assets, onRefresh }: AdminMediaPanelProps) {
  const token = { accessToken };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [folder, setFolder] = useState<MediaFolder>("images");
  const [kindFilter, setKindFilter] = useState<(typeof KIND_FILTERS)[number]>("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<DbMediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    alt_text: "",
    asset_key: "",
    folder: "images",
    is_active: true,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (kindFilter !== "all" && a.media_kind !== kindFilter) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.original_filename.toLowerCase().includes(q) ||
        (a.asset_key ?? "").toLowerCase().includes(q) ||
        a.folder.toLowerCase().includes(q)
      );
    });
  }, [assets, kindFilter, search]);

  const resetEdit = () => {
    setEditing(null);
    setEditForm({ title: "", alt_text: "", asset_key: "", folder: "images", is_active: true });
    setError(null);
  };

  const startEdit = (asset: DbMediaAsset) => {
    setEditing(asset);
    setEditForm({
      title: asset.title,
      alt_text: asset.alt_text,
      asset_key: asset.asset_key ?? "",
      folder: asset.folder,
      is_active: asset.is_active,
    });
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const kind = inferMediaKind(file.type);
        const uploadFolder = (kind === "pdf" && folder === "images" ? defaultFolderForKind(kind) : folder) as MediaFolder;
        const uploaded = await uploadMediaFile(file, uploadFolder);
        const baseName = file.name.replace(/\.[^.]+$/, "");
        await cmaCreateMediaAsset({
          data: {
            ...token,
            payload: {
              storage_path: uploaded.storagePath,
              public_url: uploaded.publicUrl,
              original_filename: uploaded.originalFilename,
              mime_type: uploaded.mimeType,
              media_kind: uploaded.mediaKind,
              folder: uploadFolder,
              title: baseName,
              alt_text: "",
              byte_size: uploaded.byteSize,
              tags: [],
              is_active: true,
            },
          },
        });
      }
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    setError(null);
    try {
      await cmaUpdateMediaAsset({
        data: {
          ...token,
          id: editing.id,
          payload: {
            title: editForm.title,
            alt_text: editForm.alt_text,
            asset_key: editForm.asset_key.trim() || null,
            folder: editForm.folder,
            is_active: editForm.is_active,
          },
        },
      });
      resetEdit();
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const handleReplace = async (file: File | undefined) => {
    if (!editing || !file) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await replaceMediaFile(editing.storage_path, file);
      await cmaReplaceMediaAssetFile({
        data: {
          ...token,
          id: editing.id,
          payload: {
            storage_path: uploaded.storagePath,
            public_url: uploaded.publicUrl,
            original_filename: uploaded.originalFilename,
            mime_type: uploaded.mimeType,
            media_kind: uploaded.mediaKind,
            byte_size: uploaded.byteSize,
            previous_storage_path: editing.storage_path,
          },
        },
      });
      await onRefresh();
      const refreshed = await fetchMediaAssets({ data: token });
      const updated = (refreshed as DbMediaAsset[]).find((a) => a.id === editing.id);
      if (updated) startEdit(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Replace failed");
    } finally {
      setBusy(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this file from storage and the media library?")) return;
    setBusy(true);
    setError(null);
    try {
      await cmaDeleteMediaAsset({ data: { ...token, id } });
      if (editing?.id === id) resetEdit();
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = useCallback(async (url: string) => {
    await navigator.clipboard.writeText(url);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-navy">Media library</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and manage images, videos and PDFs in the <strong>Content-GPWS</strong> bucket. Use asset keys
            (e.g. <code className="text-xs">campus-main</code>) on explore cards; paste URLs on notices.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onRefresh()} disabled={busy}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="card-premium grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="upload-folder">Upload folder</Label>
            <Select value={folder} onValueChange={(v) => setFolder(v as MediaFolder)}>
              <SelectTrigger id="upload-folder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_FOLDERS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="media-search">Search</Label>
            <Input
              id="media-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, filename, asset key…"
            />
          </div>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            className="sr-only"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <Button type="button" disabled={busy} onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4" />
            Upload files
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red/30 bg-red/5 px-4 py-3 text-sm text-red" role="alert">
          {error}
        </p>
      )}

      <Tabs value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="all">All ({assets.length})</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="pdf">PDFs</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value={kindFilter} className="mt-4">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No media files yet. Upload images, videos or PDFs above.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((asset) => (
                <MediaAssetCard
                  key={asset.id}
                  asset={asset}
                  busy={busy}
                  selected={editing?.id === asset.id}
                  onEdit={() => startEdit(asset)}
                  onDelete={() => void remove(asset.id)}
                  onCopy={() => void copyUrl(asset.public_url)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {editing && (
        <div className="card-premium space-y-4 p-5">
          <h3 className="font-display text-lg font-bold text-navy">Edit media</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-key">Asset key (for explore cards)</Label>
              <Input
                id="edit-key"
                value={editForm.asset_key}
                onChange={(e) => setEditForm((f) => ({ ...f, asset_key: e.target.value }))}
                placeholder="e.g. campus-main"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-alt">Alt text (images)</Label>
              <Input
                id="edit-alt"
                value={editForm.alt_text}
                onChange={(e) => setEditForm((f) => ({ ...f, alt_text: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-folder">Folder</Label>
              <Select value={editForm.folder} onValueChange={(v) => setEditForm((f) => ({ ...f, folder: v }))}>
                <SelectTrigger id="edit-folder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_FOLDERS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="edit-active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm((f) => ({ ...f, is_active: checked }))}
              />
              <Label htmlFor="edit-active">Active (visible on site)</Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground break-all">
            URL: {editing.public_url} · {formatByteSize(editing.byte_size)} · {editing.storage_path}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void saveEdit()} disabled={busy}>
              Save changes
            </Button>
            <input
              ref={replaceInputRef}
              type="file"
              accept={editing.media_kind === "pdf" ? "application/pdf" : editing.media_kind === "video" ? "video/*" : "image/*"}
              className="sr-only"
              onChange={(e) => void handleReplace(e.target.files?.[0])}
            />
            <Button type="button" variant="outline" disabled={busy} onClick={() => replaceInputRef.current?.click()}>
              Replace file
            </Button>
            <Button type="button" variant="outline" onClick={() => void copyUrl(editing.public_url)}>
              <Copy className="size-4" />
              Copy URL
            </Button>
            <Button type="button" variant="ghost" onClick={resetEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaAssetCard({
  asset,
  busy,
  selected,
  onEdit,
  onDelete,
  onCopy,
}: {
  asset: DbMediaAsset;
  busy: boolean;
  selected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  return (
    <article
      className={`card-premium overflow-hidden transition-colors ${selected ? "ring-2 ring-brand" : ""}`}
    >
      <div className="flex aspect-video items-center justify-center bg-light-blue/50">
        {asset.media_kind === "image" && asset.public_url ? (
          <img src={asset.public_url} alt={asset.alt_text || asset.title} className="size-full object-cover" />
        ) : asset.media_kind === "video" ? (
          <Film className="size-10 text-brand" aria-hidden="true" />
        ) : asset.media_kind === "pdf" ? (
          <FileText className="size-10 text-brand" aria-hidden="true" />
        ) : (
          <ImageIcon className="size-10 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="truncate font-display text-sm font-bold text-navy">{asset.title || asset.original_filename}</p>
        <p className="text-[11px] text-muted-foreground">
          {asset.media_kind} · {asset.folder} · {formatByteSize(asset.byte_size)}
        </p>
        {asset.asset_key && (
          <p className="truncate text-[11px] font-medium text-brand">key: {asset.asset_key}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onCopy}>
            <Copy className="size-3.5" />
          </Button>
          <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={onDelete}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export { AdminMediaPanel as default };
