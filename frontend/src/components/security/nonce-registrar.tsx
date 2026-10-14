"use client";

import { setNonce } from "get-nonce";

export function NonceRegistrar({ nonce }: { nonce: string | undefined }) {
  if (nonce !== undefined) {
    setNonce(nonce);
  }
  return null;
}
