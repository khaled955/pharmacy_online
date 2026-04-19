"use client";
import { useEffect } from "react";

export function WhatsAppAutoOpen({ url }: { url: string }) {
  useEffect(() => {
    window.open(url, "_blank");
  }, [url]);

  return null;
}
