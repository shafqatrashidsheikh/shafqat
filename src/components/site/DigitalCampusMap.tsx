import { useCallback, useId, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import {
  GPW_CAMPUS_FOOTPRINTS,
  GPW_CAMPUS_META,
  GPW_CAMPUS_ORIGIN,
  GPW_CAMPUS_PRECINCT,
  type CampusFootprint,
} from "@/lib/digital-campus-geometry";
import { cn } from "@/lib/utils";

type DigitalCampusMapProps = {
  className?: string;
  aspectClassName?: string;
};

type Pt = { x: number; y: number };

const VIEW = { w: 1000, h: 750 };
const METERS_PER_DEG_LAT = 111_320;

/**
 * Premium digital-twin campus map for the homepage hero.
 * Real OSM college footprints → isometric architectural massing.
 * No satellite tiles, map controls, invented roads/trees, or department pins.
 */
export function DigitalCampusMap({
  className,
  aspectClassName = "aspect-[4/3]",
}: DigitalCampusMapProps) {
  const titleId = useId();
  const uid = useId().replace(/:/g, "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scale, setScale] = useState(1.08);
  const [pan, setPan] = useState({ x: 0, y: 12 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const scene = useMemo(() => buildScene(), []);
  const focus = scene.buildings.find((b) => b.id === hoveredId) ?? null;

  const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.94 : 1.06;
    setScale((s) => Math.min(1.85, Math.max(0.85, s * delta)));
  }, []);

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan.x, pan.y]);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.panX + (e.clientX - drag.current.x),
      y: drag.current.panY + (e.clientY - drag.current.y),
    });
  }, []);

  const onPointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      className={cn(
        "relative min-w-0 cursor-grab overflow-hidden bg-[#E8EEF8] active:cursor-grabbing",
        aspectClassName,
        className,
      )}
      role="region"
      aria-labelledby={titleId}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <h2 id={titleId} className="sr-only">
        Digital campus map — {GPW_CAMPUS_META.name}
      </h2>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 55% 40%, #F8FBFF 0%, #E8EEF8 55%, #D9E2F5 100%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="absolute inset-0 size-full touch-none select-none"
        role="img"
        aria-label="Architectural site map of the Bemina campus from OpenStreetMap building footprints"
      >
        <defs>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0B1F3A" floodOpacity="0.1" />
          </filter>
          <filter id={`${uid}-bldg`} x="-15%" y="-10%" width="140%" height="140%">
            <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#0B1F3A" floodOpacity="0.14" />
          </filter>
          <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7FAFF" />
            <stop offset="100%" stopColor="#D2DCEC" />
          </linearGradient>
          <linearGradient id={`${uid}-wl`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A4A7A" />
            <stop offset="100%" stopColor="#0B1F3A" />
          </linearGradient>
          <linearGradient id={`${uid}-wr`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D5F94" />
            <stop offset="100%" stopColor="#16325A" />
          </linearGradient>
          <linearGradient id={`${uid}-wf`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3AA8" />
            <stop offset="100%" stopColor="#0F2A6B" />
          </linearGradient>
        </defs>

        <g
          transform={`translate(${VIEW.w / 2 + pan.x} ${VIEW.h / 2 + pan.y}) scale(${scale}) translate(${-VIEW.w / 2} ${-VIEW.h / 2})`}
        >
          <polygon
            points={toPoints(scene.precinct)}
            fill="#F8FBFF"
            stroke="#B8C7E0"
            strokeWidth="1.2"
            filter={`url(#${uid}-soft)`}
          />
          <polygon
            points={toPoints(scene.precinctInset)}
            fill="#EEF3FA"
            stroke="#C9D5E8"
            strokeWidth="0.7"
            strokeDasharray="5 6"
          />

          {scene.buildings.map((b) => {
            const isFocus = hoveredId === b.id;
            return (
              <g
                key={b.id}
                filter={`url(#${uid}-bldg)`}
                className="outline-none"
                role="button"
                tabIndex={0}
                aria-label={b.label}
                onMouseEnter={() => setHoveredId(b.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(b.id)}
                onBlur={() => setHoveredId(null)}
                style={{ cursor: "pointer" }}
              >
                {b.walls.map((wall, wi) => (
                  <polygon
                    key={`${b.id}-w-${wi}`}
                    points={toPoints(wall.pts)}
                    fill={
                      wall.side === "left"
                        ? `url(#${uid}-wl)`
                        : wall.side === "right"
                          ? `url(#${uid}-wr)`
                          : `url(#${uid}-wf)`
                    }
                    opacity={isFocus ? 1 : 0.92}
                  />
                ))}
                <polygon
                  points={toPoints(b.roof)}
                  fill={isFocus ? "#FFFFFF" : `url(#${uid}-roof)`}
                  stroke={isFocus ? "#1E3AA8" : "#9AB0CC"}
                  strokeWidth={isFocus ? 1.8 : 1}
                />
              </g>
            );
          })}

          {focus && (
            <g transform={`translate(${focus.labelAnchor.x}, ${focus.labelAnchor.y})`}>
              <rect
                x={-8}
                y={-24}
                width={Math.min(280, Math.max(108, focus.label.length * 7.2 + 24))}
                height="28"
                rx="3"
                fill="#FFFFFF"
                stroke="#C5D0E2"
                strokeWidth="1"
              />
              <text
                x="6"
                y="-5"
                fill="#0B1F3A"
                fontFamily="Manrope, system-ui, sans-serif"
                fontSize="12"
                fontWeight="700"
              >
                {focus.label}
              </text>
            </g>
          )}
        </g>
      </svg>

      <p className="pointer-events-none absolute bottom-2.5 left-3 text-[0.625rem] font-medium tracking-wide text-navy/40 sm:bottom-3 sm:left-4">
        Bemina · OSM building footprints
      </p>
    </div>
  );
}

function toPoints(pts: Pt[]) {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

type Projector = (lng: number, lat: number) => Pt;

function makeProjector(allLngLat: readonly (readonly [number, number])[]): Projector {
  const metersPerDegLng = METERS_PER_DEG_LAT * Math.cos((GPW_CAMPUS_ORIGIN.lat * Math.PI) / 180);

  const raw = allLngLat.map(([lng, lat]) => {
    const east = (lng - GPW_CAMPUS_ORIGIN.lng) * metersPerDegLng;
    const north = (lat - GPW_CAMPUS_ORIGIN.lat) * METERS_PER_DEG_LAT;
    return {
      x: east - north,
      y: -(east + north) * 0.55,
    };
  });

  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const padX = 130;
  const padY = 120;
  const fit = Math.min((VIEW.w - padX * 2) / spanX, (VIEW.h - padY * 2) / spanY);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return (lng: number, lat: number) => {
    const east = (lng - GPW_CAMPUS_ORIGIN.lng) * metersPerDegLng;
    const north = (lat - GPW_CAMPUS_ORIGIN.lat) * METERS_PER_DEG_LAT;
    const x = east - north;
    const y = -(east + north) * 0.55;
    return {
      x: VIEW.w / 2 + (x - midX) * fit,
      y: VIEW.h / 2 + 20 + (y - midY) * fit,
    };
  };
}

function elevate(p: Pt, h: number): Pt {
  return { x: p.x, y: p.y - h };
}

function centroid(pts: Pt[]): Pt {
  const closed =
    pts.length > 1 && pts[0].x === pts[pts.length - 1].x && pts[0].y === pts[pts.length - 1].y;
  const n = Math.max(closed ? pts.length - 1 : pts.length, 1);
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i += 1) {
    sx += pts[i].x;
    sy += pts[i].y;
  }
  return { x: sx / n, y: sy / n };
}

function insetPolygon(pts: Pt[], amount: number): Pt[] {
  const c = centroid(pts);
  return pts.map((p) => ({
    x: c.x + (p.x - c.x) * (1 - amount),
    y: c.y + (p.y - c.y) * (1 - amount),
  }));
}

type WallFace = { pts: Pt[]; side: "left" | "right" | "front" };

type SceneBuilding = {
  id: string;
  label: string;
  roof: Pt[];
  walls: WallFace[];
  labelAnchor: Pt;
  sortY: number;
};

function extrudeBuilding(foot: CampusFootprint, project: Projector): SceneBuilding {
  const base = foot.ring.map(([lng, lat]) => project(lng, lat));
  const height = foot.storeys === 2 ? 36 : 22;
  const roof = base.map((p) => elevate(p, height));
  const walls: WallFace[] = [];

  for (let i = 0; i < base.length - 1; i += 1) {
    const a = base[i];
    const b = base[i + 1];
    const dx = b.x - a.x;
    const side: WallFace["side"] = dx < -2 ? "left" : dx > 2 ? "right" : "front";
    walls.push({
      side,
      pts: [a, b, elevate(b, height), elevate(a, height)],
    });
  }

  walls.sort((w1, w2) => Math.max(...w1.pts.map((p) => p.y)) - Math.max(...w2.pts.map((p) => p.y)));

  const c = centroid(roof);
  return {
    id: foot.id,
    label: foot.label,
    roof,
    walls,
    labelAnchor: { x: c.x, y: Math.min(...roof.map((p) => p.y)) - 12 },
    sortY: Math.max(...base.map((p) => p.y)),
  };
}

function buildScene() {
  const allCoords = [...GPW_CAMPUS_PRECINCT, ...GPW_CAMPUS_FOOTPRINTS.flatMap((f) => f.ring)];
  const project = makeProjector(allCoords);
  const precinct = GPW_CAMPUS_PRECINCT.map(([lng, lat]) => project(lng, lat));
  const precinctInset = insetPolygon(precinct, 0.04);
  const buildings = GPW_CAMPUS_FOOTPRINTS.map((f) => extrudeBuilding(f, project)).sort(
    (a, b) => a.sortY - b.sortY,
  );
  return { precinct, precinctInset, buildings };
}
