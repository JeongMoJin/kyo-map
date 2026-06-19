"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { House } from "@/lib/types";
import { USE_COLORS, USE_LABELS } from "@/lib/types";

// Fix default icon paths (not used, but avoids console warnings)
// @ts-expect-error leaflet private
delete L.Icon.Default.prototype._getIconUrl;

const iconCache = new Map<string, DivIcon>();
function getMarkerIcon(color: string, risk: boolean): DivIcon {
  const key = `${color}-${risk}`;
  if (iconCache.has(key)) return iconCache.get(key)!;
  const icon = L.divIcon({
    className: "",
    html: `<div class="kyo-marker" data-risk="${risk}" style="color:${color}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
  iconCache.set(key, icon);
  return icon;
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

/**
 * Ctrl/⌘ + 휠로만 줌을 허용. 일반 휠은 페이지 스크롤로 넘긴다.
 */
function ModifierWheelZoom() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1 : -1;
        map.setZoom(map.getZoom() + delta, { animate: true });
      }
      // modifier 없으면 default 동작(페이지 스크롤) 허용
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [map]);
  return null;
}

export default function HouseMap({
  houses,
  center = [36.3, 127.8],
  zoom = 7,
}: {
  houses: House[];
  center?: [number, number];
  zoom?: number;
}) {
  const markers = useMemo(() => houses, [houses]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      doubleClickZoom
      className="h-full w-full"
      zoomControl={false}
      worldCopyJump={false}
    >
      <Recenter center={center} zoom={zoom} />
      <ModifierWheelZoom />
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((h) => {
        const color = USE_COLORS[h.recommendedUse];
        return (
          <Marker
            key={h.id}
            position={[h.lat, h.lng]}
            icon={getMarkerIcon(color, h.isDisasterZone)}
          >
            <Popup>
              <div className="p-4 font-sans">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                      {h.id} · {USE_LABELS[h.recommendedUse]}
                    </div>
                    <div className="mt-0.5 text-[13.5px] font-bold leading-tight text-[color:var(--foreground)]">
                      {h.address}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[color:var(--surface-muted)] p-2.5 text-[11.5px]">
                  <div>
                    <div className="text-[color:var(--ink-muted)]">AI 신뢰도</div>
                    <div className="tnum font-bold text-[color:var(--foreground)]">
                      {(h.aiConfidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[color:var(--ink-muted)]">준공연도</div>
                    <div className="tnum font-bold text-[color:var(--foreground)]">
                      {h.buildYear}년
                    </div>
                  </div>
                </div>
                {h.isDisasterZone && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10.5px] font-bold text-red-700">
                    ⚠ 붕괴위험 안심구역 내
                  </div>
                )}
                <Link
                  href={`/house/${h.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[color:var(--brand-800)] px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[color:var(--brand-900)]"
                >
                  상세 보기 →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
