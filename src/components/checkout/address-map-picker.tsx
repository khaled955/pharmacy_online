"use client";
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export type MapCoords = { lat: number; lng: number };

interface AddressMapPickerProps {
  value?: MapCoords;
  onChange: (coords: MapCoords) => void;
}

const DEFAULT_CENTER: MapCoords = { lat: 24.7136, lng: 46.6753 };

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CDN = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).L) return (window as any).L;

  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${LEAFLET_CDN}/leaflet.css`;
    document.head.appendChild(link);
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${LEAFLET_CDN}/leaflet.js`;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).L;
}

export function AddressMapPicker({ value, onChange }: AddressMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;

      const L = await loadLeaflet();

      // Fix default icon paths for bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: `${LEAFLET_CDN}/images/marker-icon-2x.png`,
        iconUrl: `${LEAFLET_CDN}/images/marker-icon.png`,
        shadowUrl: `${LEAFLET_CDN}/images/marker-shadow.png`,
      });

      if (!isMounted || !containerRef.current) return;

      const center = value ?? DEFAULT_CENTER;
      const map = L.map(containerRef.current).setView([center.lat, center.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker([center.lat, center.lng], { draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange({ lat: pos.lat, lng: pos.lng });
      });

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    initMap();

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (markerRef.current && value) {
      markerRef.current.setLatLng([value.lat, value.lng]);
      mapRef.current?.panTo([value.lat, value.lng]);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <span>Click the map or drag the pin to set your delivery location</span>
      </div>
      <div
        ref={containerRef}
        className="h-64 w-full rounded-xl overflow-hidden border border-border"
      />
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
