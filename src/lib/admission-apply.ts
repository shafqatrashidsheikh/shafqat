import {
  emptyAdmissionStatusPayload,
  type JkboteAdmissionStatusPayload,
} from "@/lib/jkbote-admission-status";

export async function loadAdmissionPortalStatus(options?: {
  force?: boolean;
  signal?: AbortSignal;
}): Promise<JkboteAdmissionStatusPayload> {
  const qs = options?.force ? "?refresh=1" : "";
  try {
    const res = await fetch(`/api/jkbote-admission-status${qs}`, {
      credentials: "same-origin",
      signal: options?.signal,
      headers: { Accept: "application/json" },
    });
    const data = (await res.json()) as JkboteAdmissionStatusPayload;
    if (!data?.portalUrl || !data.status) {
      return emptyAdmissionStatusPayload({
        error: "Invalid admission status response",
      });
    }
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return emptyAdmissionStatusPayload({
      error: error instanceof Error ? error.message : "Unable to load admission status",
    });
  }
}
