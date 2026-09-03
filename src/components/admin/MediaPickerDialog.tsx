import { useMemo, useState } from "react";
import { Check, Copy, FileText, Film, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatByteSize } from "@/lib/media/kind";
import type { DbMediaAsset } from "@/lib/supabase/types";

type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: DbMediaAsset[];
  /** Restrict picker to certain kinds */
  kinds?: DbMediaAsset["media_kind"][];
  onSelect: (asset: DbMediaAsset) => void;
};

export function MediaPickerDialog({
  open,
  onOpenChange,
  assets,
  kinds,
  onSelect,
}: MediaPickerDialogProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (!a.is_active || !a.public_url) return false;
      if (kinds?.length && !kinds.includes(a.media_kind)) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.original_filename.toLowerCase().includes(q) ||
        (a.asset_key ?? "").toLowerCase().includes(q)
      );
    });
  }, [assets, kinds, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose from media library</DialogTitle>
          <DialogDescription>Select an uploaded file from Content-GPWS.</DialogDescription>
        </DialogHeader>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or filename…"
          className="shrink-0"
        />
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <li className="py-8 text-center text-sm text-muted-foreground">No matching files. Upload in Media tab first.</li>
          ) : (
            filtered.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-white p-3 text-left transition-colors hover:border-brand/40 hover:bg-light-blue/30"
                  onClick={() => {
                    onSelect(asset);
                    onOpenChange(false);
                  }}
                >
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-light-blue">
                    {asset.media_kind === "image" ? (
                      <img src={asset.public_url} alt="" className="size-full object-cover" />
                    ) : asset.media_kind === "video" ? (
                      <Film className="size-5 text-brand" />
                    ) : asset.media_kind === "pdf" ? (
                      <FileText className="size-5 text-brand" />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-navy">{asset.title || asset.original_filename}</span>
                    <span className="text-xs text-muted-foreground">
                      {asset.media_kind} · {formatByteSize(asset.byte_size)}
                    </span>
                  </span>
                  <Check className="size-4 shrink-0 text-brand opacity-0" aria-hidden="true" />
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

type MediaUrlFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  assets: DbMediaAsset[];
  kinds?: DbMediaAsset["media_kind"][];
};

/** Input + browse library for notice PDFs and other file URLs. */
export function MediaUrlField({ label, value, onChange, assets, kinds = ["pdf", "other"] }: MediaUrlFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium leading-none">{label}</label>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or pick from library"
            className="mt-2"
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
          Browse library
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => void navigator.clipboard.writeText(value)}>
            <Copy className="size-4" />
          </Button>
        )}
      </div>
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        assets={assets}
        kinds={kinds}
        onSelect={(asset) => {
          onChange(asset.public_url);
        }}
      />
    </div>
  );
}
