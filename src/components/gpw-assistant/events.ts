export const GPW_ASSISTANT_OPEN_EVENT = "gpw-assistant-open";

export function openGPWAssistant() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GPW_ASSISTANT_OPEN_EVENT));
}
