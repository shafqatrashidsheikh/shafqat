import { useEffect, useRef, useState } from "react";
import {
  CONNECTION_ERROR_COPY,
  OFFLINE_FAIL_QUIPS,
  OFFLINE_MILESTONES,
} from "@/lib/network-error";
import { cn } from "@/lib/utils";

type Obstacle = { x: number; w: number; h: number; kind: 0 | 1 | 2 | 3 };
type Star = { x: number; y: number; taken: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

/**
 * Campus Dash — playful offline arcade (Chrome-dino energy, GPW flavour).
 * Space / ↑ / tap to jump. Collect stars. Double-jump mid-air.
 */
export function OfflineRunnerGame({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<"ready" | "running" | "over">("ready");
  const [quip, setQuip] = useState<string>(OFFLINE_FAIL_QUIPS[0]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("gpw-campus-dash-best") || "0");
      if (Number.isFinite(saved)) setBest(saved);
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const measureWidth = () => {
      const parentW = canvas.parentElement?.clientWidth;
      if (parentW && parentW > 0) return Math.min(560, parentW);
      if (typeof window !== "undefined") return Math.min(560, Math.max(240, window.innerWidth - 64));
      return 320;
    };

    let cssW = measureWidth();
    const cssH = 188;

    const resize = () => {
      cssW = measureWidth();
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = "100%";
      canvas.style.maxWidth = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      ro = new ResizeObserver(() => {
        resize();
      });
      ro.observe(canvas.parentElement);
    }

    const groundY = cssH - 28;
    let playerY = 0;
    let vy = 0;
    let onGround = true;
    let jumpsLeft = 2;
    let speed = reduced ? 3.4 : 4.6;
    let distance = 0;
    let frame = 0;
    let running = false;
    let dead = false;
    let obstacles: Obstacle[] = [];
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let spawnIn = 80;
    let starSpawnIn = 110;
    let raf = 0;
    let localScore = 0;
    let hitMilestones = new Set<number>();
    let shake = 0;
    let flash = 0;

    const bust = (label: string) => {
      setToast(label);
      window.setTimeout(() => setToast((t) => (t === label ? null : t)), 1600);
    };

    const explode = (x: number, y: number, color: string, n = 10) => {
      for (let i = 0; i < n; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -Math.random() * 4 - 1,
          life: 18 + Math.random() * 14,
          color,
        });
      }
    };

    const jump = () => {
      if (dead) {
        playerY = 0;
        vy = 0;
        onGround = true;
        jumpsLeft = 2;
        speed = reduced ? 3.4 : 4.6;
        distance = 0;
        frame = 0;
        obstacles = [];
        stars = [];
        particles = [];
        spawnIn = 70;
        starSpawnIn = 90;
        dead = false;
        running = true;
        localScore = 0;
        hitMilestones = new Set();
        shake = 0;
        flash = 0;
        setScore(0);
        setStatus("running");
        setToast(null);
        return;
      }
      if (!running) {
        running = true;
        setStatus("running");
      }
      if (jumpsLeft > 0) {
        vy = jumpsLeft === 2 ? -10.2 : -8.4;
        onGround = false;
        jumpsLeft -= 1;
        explode(44, groundY + playerY - 10, "#F4C430", 5);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onPointer = (e: Event) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", resize);

    const spawnObstacle = () => {
      const kind = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
      const sizes = [
        { w: 18, h: 30 },
        { w: 26, h: 38 },
        { w: 36, h: 20 },
        { w: 22, h: 34 },
      ];
      const s = sizes[kind]!;
      obstacles.push({ x: cssW + 12, w: s.w, h: s.h, kind });
    };

    const spawnStar = () => {
      stars.push({
        x: cssW + 20,
        y: groundY - (48 + Math.random() * 54),
        taken: false,
      });
    };

    const drawHills = (offset: number) => {
      const o1 = -((offset * 0.15) % (cssW + 80));
      ctx.fillStyle = "#D5E4F7";
      ctx.beginPath();
      ctx.moveTo(o1, groundY);
      for (let i = 0; i < 4; i++) {
        const x = o1 + i * (cssW / 2 + 40);
        ctx.quadraticCurveTo(x + 60, groundY - 42 - (i % 2) * 12, x + 140, groundY);
      }
      ctx.lineTo(cssW + 40, groundY);
      ctx.lineTo(o1, groundY);
      ctx.fill();

      const o2 = -((offset * 0.28) % (cssW + 60));
      ctx.fillStyle = "#B8CDE8";
      ctx.beginPath();
      ctx.moveTo(o2, groundY);
      for (let i = 0; i < 5; i++) {
        const x = o2 + i * (cssW / 2.4 + 30);
        ctx.quadraticCurveTo(x + 40, groundY - 26 - (i % 3) * 8, x + 100, groundY);
      }
      ctx.lineTo(cssW + 40, groundY);
      ctx.lineTo(o2, groundY);
      ctx.fill();
    };

    const drawCloud = (x: number, y: number, s: number) => {
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.beginPath();
      ctx.arc(x, y, 10 * s, 0, Math.PI * 2);
      ctx.arc(x + 12 * s, y - 4 * s, 12 * s, 0, Math.PI * 2);
      ctx.arc(x + 24 * s, y, 9 * s, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPlayer = (x: number, y: number) => {
      const bob = running && onGround ? Math.sin(frame / 4) * 1.2 : 0;
      const base = y + bob;
      // body
      ctx.fillStyle = "#17365D";
      roundRect(ctx, x, base - 30, 20, 24, 5);
      ctx.fill();
      // scarf
      ctx.fillStyle = "#F4C430";
      ctx.fillRect(x + 2, base - 22, 16, 4);
      // cap
      ctx.fillStyle = "#2457A6";
      ctx.beginPath();
      ctx.moveTo(x - 3, base - 30);
      ctx.lineTo(x + 10, base - 42);
      ctx.lineTo(x + 23, base - 30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#F4C430";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x + 20, base - 32);
      ctx.lineTo(x + 28, base - 18);
      ctx.stroke();
      ctx.fillStyle = "#F4C430";
      ctx.beginPath();
      ctx.arc(x + 28, base - 16, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // eye
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x + 14, base - 22, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // legs
      const leg = Math.floor(frame / 5) % 2;
      ctx.fillStyle = "#0F2744";
      const kick = running && onGround ? 3 : 0;
      ctx.fillRect(x + 3, base - 8, 5, 10 + (leg ? kick : 0));
      ctx.fillRect(x + 12, base - 8, 5, 10 + (leg ? 0 : kick));
      // jump spark
      if (!onGround) {
        ctx.fillStyle = "rgba(244,196,48,0.55)";
        ctx.fillRect(x + 4, base + 2, 12, 2);
      }
    };

    const drawObstacle = (o: Obstacle) => {
      const top = groundY - o.h;
      if (o.kind === 0) {
        // textbook
        ctx.fillStyle = "#2457A6";
        roundRect(ctx, o.x, top, o.w, o.h, 2);
        ctx.fill();
        ctx.fillStyle = "#F8FAFF";
        ctx.fillRect(o.x + 3, top + 5, 3, o.h - 10);
        ctx.fillStyle = "#F4C430";
        ctx.fillRect(o.x + 8, top + 6, o.w - 11, 3);
      } else if (o.kind === 1) {
        // angry router
        ctx.fillStyle = "#17365D";
        roundRect(ctx, o.x, top + 10, o.w, o.h - 10, 3);
        ctx.fill();
        ctx.strokeStyle = "#8FA3BF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(o.x + 6, top + 10);
        ctx.lineTo(o.x + 6, top);
        ctx.moveTo(o.x + o.w - 6, top + 10);
        ctx.lineTo(o.x + o.w - 6, top);
        ctx.stroke();
        ctx.fillStyle = "#C5221F";
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, top + 18, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.kind === 2) {
        // exam paper stack
        ctx.fillStyle = "#F8FAFF";
        roundRect(ctx, o.x, top, o.w, o.h, 2);
        ctx.fill();
        ctx.strokeStyle = "#8FA3BF";
        ctx.stroke();
        ctx.strokeStyle = "#2457A6";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(o.x + 5, top + 6 + i * 5);
          ctx.lineTo(o.x + o.w - 5, top + 6 + i * 5);
          ctx.stroke();
        }
      } else {
        // chai cup
        ctx.fillStyle = "#C4A484";
        roundRect(ctx, o.x + 2, top + 8, o.w - 4, o.h - 8, 3);
        ctx.fill();
        ctx.strokeStyle = "#8B6914";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(o.x + o.w - 2, top + 16, 6, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(120,80,40,0.35)";
        ctx.beginPath();
        ctx.ellipse(o.x + o.w / 2, top + 10, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStar = (s: Star) => {
      if (s.taken) return;
      const twinkle = 1 + Math.sin(frame / 6 + s.x) * 0.12;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.scale(twinkle, twinkle);
      ctx.fillStyle = "#F4C430";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? 7 : 3.2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      frame += 1;
      const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      if (shake > 0) shake *= 0.86;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.clearRect(-4, -4, cssW + 8, cssH + 8);

      // sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, cssH);
      sky.addColorStop(0, "#EAF2FF");
      sky.addColorStop(0.55, "#F4F8FD");
      sky.addColorStop(1, "#DDE8F6");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, cssW, cssH);

      if (running) {
        drawCloud(((cssW * 0.2 - distance * 0.2) % (cssW + 80)) + 40, 28, 1);
        drawCloud(((cssW * 0.7 - distance * 0.12) % (cssW + 100)) + 20, 48, 0.75);
      } else {
        drawCloud(cssW * 0.25, 30, 1);
        drawCloud(cssW * 0.7, 46, 0.8);
      }

      drawHills(distance);

      // ground band
      ctx.fillStyle = "#C5D3E8";
      ctx.fillRect(0, groundY, cssW, cssH - groundY);
      ctx.fillStyle = "#A8BDD8";
      ctx.fillRect(0, groundY, cssW, 3);

      // path dashes
      const dashOffset = running ? -(distance % 28) : 0;
      ctx.strokeStyle = "#E8EEF7";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 12]);
      ctx.lineDashOffset = dashOffset;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 12);
      ctx.lineTo(cssW, groundY + 12);
      ctx.stroke();
      ctx.setLineDash([]);

      if (running && !dead) {
        distance += speed;
        speed = Math.min(reduced ? 6 : 9.2, speed + 0.0018);
        localScore = Math.floor(distance / 10);
        if (frame % 6 === 0) setScore(localScore);

        for (const m of OFFLINE_MILESTONES) {
          if (localScore >= m.at && !hitMilestones.has(m.at)) {
            hitMilestones.add(m.at);
            bust(m.label);
            explode(cssW / 2, 40, "#2457A6", 14);
          }
        }

        vy += 0.58;
        playerY += vy;
        if (playerY >= 0) {
          if (!onGround) explode(44, groundY - 2, "#8FA3BF", 4);
          playerY = 0;
          vy = 0;
          onGround = true;
          jumpsLeft = 2;
        }

        spawnIn -= 1;
        if (spawnIn <= 0) {
          spawnObstacle();
          spawnIn = 48 + Math.floor(Math.random() * 50) - Math.min(22, speed * 2);
        }
        starSpawnIn -= 1;
        if (starSpawnIn <= 0) {
          spawnStar();
          starSpawnIn = 90 + Math.floor(Math.random() * 70);
        }

        obstacles = obstacles.filter((o) => o.x + o.w > -12);
        for (const o of obstacles) {
          o.x -= speed;
          const px = 40;
          const py = groundY + playerY;
          const pb = { l: px + 2, r: px + 18, t: py - 40, b: py };
          const ob = { l: o.x + 2, r: o.x + o.w - 2, t: groundY - o.h + 1, b: groundY };
          if (pb.l < ob.r && pb.r > ob.l && pb.t < ob.b && pb.b > ob.t) {
            dead = true;
            running = false;
            shake = 7;
            flash = 10;
            setStatus("over");
            setScore(localScore);
            setQuip(OFFLINE_FAIL_QUIPS[Math.floor(Math.random() * OFFLINE_FAIL_QUIPS.length)]!);
            explode(px + 10, py - 16, "#C5221F", 16);
            setBest((prev) => {
              const next = Math.max(prev, localScore);
              try {
                localStorage.setItem("gpw-campus-dash-best", String(next));
              } catch {
                /* ignore */
              }
              return next;
            });
          }
        }

        for (const s of stars) {
          if (s.taken) continue;
          s.x -= speed;
          const px = 40;
          const py = groundY + playerY - 20;
          if (Math.hypot(s.x - (px + 10), s.y - py) < 18) {
            s.taken = true;
            localScore += 15;
            setScore(localScore);
            explode(s.x, s.y, "#F4C430", 12);
            bust("+15 ★");
          }
        }
        stars = stars.filter((s) => s.x > -20 && !s.taken);
      }

      // particles
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.life -= 1;
        ctx.globalAlpha = Math.max(0, p.life / 24);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
      }

      for (const o of obstacles) drawObstacle(o);
      for (const s of stars) drawStar(s);
      drawPlayer(40, groundY + playerY);

      // HUD
      ctx.fillStyle = "#17365D";
      ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "right";
      ctx.fillText(String(localScore).padStart(4, "0"), cssW - 14, 20);

      if (flash > 0) {
        ctx.fillStyle = `rgba(197,34,31,${0.08 * flash})`;
        ctx.fillRect(0, 0, cssW, cssH);
        flash -= 1;
      }

      if (!running && !dead) {
        const boxW = Math.min(236, cssW - 24);
        ctx.fillStyle = "rgba(23,54,93,0.78)";
        roundRect(ctx, cssW / 2 - boxW / 2, cssH / 2 - 20, boxW, 40, 12);
        ctx.fill();
        ctx.fillStyle = "#F8FAFF";
        ctx.font = cssW < 360 ? "700 11px system-ui, sans-serif" : "700 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(CONNECTION_ERROR_COPY.gameReady, cssW / 2, cssH / 2 + 4);
      }

      if (dead) {
        ctx.fillStyle = "rgba(234,242,255,0.55)";
        ctx.fillRect(0, 0, cssW, cssH);
        ctx.fillStyle = "#17365D";
        ctx.font = cssW < 360 ? "800 14px system-ui, sans-serif" : "800 16px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(quip, cssW / 2, cssH / 2 - 8);
        ctx.font = cssW < 360 ? "600 11px system-ui, sans-serif" : "600 12px system-ui, sans-serif";
        ctx.fillStyle = "#5F6B7A";
        ctx.fillText(CONNECTION_ERROR_COPY.gameRetry, cssW / 2, cssH / 2 + 16);
      }

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointer);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("connection-dash w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.16em] text-brand uppercase truncate">
            {CONNECTION_ERROR_COPY.gameTitle}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">Double-jump enabled · grab the stars</p>
        </div>
        <div className="rounded-full border border-border bg-surface-white px-2.5 py-1 font-mono text-[11px] font-semibold text-navy shadow-soft shrink-0">
          HI {String(best).padStart(4, "0")}
          {status !== "ready" ? ` · ${String(score).padStart(4, "0")}` : null}
        </div>
      </div>

      <div className="relative mt-3">
        <canvas
          ref={canvasRef}
          className="connection-dash-canvas w-full touch-manipulation rounded-2xl border border-border/80 bg-[#eaf2ff] shadow-soft"
          role="img"
          aria-label="Campus Dash offline game. Press Space or tap to jump. Double jump in mid-air."
        />
        {toast ? (
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-navy px-3 py-1 text-[11px] font-bold text-on-dark shadow-raised motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
            {toast}
          </div>
        ) : null}
      </div>

      <p className="mt-2.5 text-center text-[12px] leading-snug text-muted-foreground">
        {CONNECTION_ERROR_COPY.gameHint}
      </p>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
