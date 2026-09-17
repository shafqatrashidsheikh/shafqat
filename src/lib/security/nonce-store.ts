/**
 * Holds the CSP nonce minted for the in-flight request. Keyed by the Request
 * object itself so concurrent SSR renders can never read each other's nonce.
 */

const nonceByRequest = new WeakMap<Request, string>();

export function createCspNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/=+$/, "");
}

export function rememberCspNonce(request: Request, nonce: string): void {
  nonceByRequest.set(request, nonce);
}

export function readCspNonce(request: Request): string | undefined {
  return nonceByRequest.get(request);
}
