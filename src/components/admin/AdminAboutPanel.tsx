import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DbAboutBlock } from "@/lib/supabase/types";

type AdminAboutPanelProps = {
  blocks: DbAboutBlock[];
  onSave: (blockKey: string, payload: Partial<DbAboutBlock>) => Promise<void>;
};

export function AdminAboutPanel({ blocks, onSave }: AdminAboutPanelProps) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { title: string; body: string; image_asset_key: string }>>(
    () =>
      Object.fromEntries(
        blocks.map((b) => [
          b.block_key,
          {
            title: b.title,
            body: b.body,
            image_asset_key: b.image_asset_key ?? "",
          },
        ]),
      ),
  );

  const saveBlock = async (blockKey: string) => {
    const draft = drafts[blockKey];
    if (!draft) return;
    setBusyKey(blockKey);
    setError(null);
    setMessage(null);
    try {
      await onSave(blockKey, {
        title: draft.title,
        body: draft.body,
        image_asset_key: draft.image_asset_key || null,
      });
      setMessage(`"${draft.title}" saved successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusyKey(null);
    }
  };

  if (!blocks.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No about blocks in the database. Run &quot;Import website content&quot; on the Overview tab first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <div key={block.block_key} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold text-navy capitalize">{block.block_key.replace(/_/g, " ")}</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Textarea
                value={drafts[block.block_key]?.title ?? block.title}
                onChange={(e) =>
                  setDrafts({
                    ...drafts,
                    [block.block_key]: {
                      ...drafts[block.block_key],
                      title: e.target.value,
                      body: drafts[block.block_key]?.body ?? block.body,
                      image_asset_key: drafts[block.block_key]?.image_asset_key ?? block.image_asset_key ?? "",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea
                className="min-h-28"
                value={drafts[block.block_key]?.body ?? block.body}
                onChange={(e) =>
                  setDrafts({
                    ...drafts,
                    [block.block_key]: {
                      ...drafts[block.block_key],
                      title: drafts[block.block_key]?.title ?? block.title,
                      body: e.target.value,
                      image_asset_key: drafts[block.block_key]?.image_asset_key ?? block.image_asset_key ?? "",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Image asset key (optional)</Label>
              <Textarea
                value={drafts[block.block_key]?.image_asset_key ?? block.image_asset_key ?? ""}
                onChange={(e) =>
                  setDrafts({
                    ...drafts,
                    [block.block_key]: {
                      ...drafts[block.block_key],
                      title: drafts[block.block_key]?.title ?? block.title,
                      body: drafts[block.block_key]?.body ?? block.body,
                      image_asset_key: e.target.value,
                    },
                  })
                }
              />
            </div>
            <Button type="button" onClick={() => void saveBlock(block.block_key)} disabled={busyKey === block.block_key}>
              {busyKey === block.block_key ? "Saving…" : "Save block"}
            </Button>
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
