import { CONNECTION_ERROR_COPY, CONNECTION_ERROR_TIPS } from "@/lib/network-error";

/** Standalone HTML for catastrophic / early boot failures (no React). Offline + mini game. */
/** `nonce` must be the request's CSP nonce, otherwise the inline script is refused. */
export function renderErrorPage(nonce?: string | undefined): string {
  const tips = CONNECTION_ERROR_TIPS.map((tip) => `<li>${tip}</li>`).join("");
  const nonceAttr = nonce ? ` nonce="${nonce}"` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${CONNECTION_ERROR_COPY.title} — ${CONNECTION_ERROR_COPY.brand}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#fafafa" />
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; }
      body {
        min-height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2.5rem 1.25rem 2rem;
        overflow-x: hidden;
        background: #fafafa;
        color: #202124;
        font: 400 14px/1.55 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      }
      @media (min-width: 640px) {
        body { align-items: center; }
      }
      .wrap { width: 100%; max-width: 34rem; text-align: center; }
      .scene { width: min(100%, 13.5rem); height: auto; margin: 0 auto; display: block; }
      .brand { margin: 1.5rem 0 0; font-size: 12px; font-weight: 500; color: #5f6368; letter-spacing: 0.02em; }
      h1 {
        margin: 0.5rem auto 0;
        max-width: 22rem;
        font-size: clamp(1.25rem, 3vw, 1.375rem);
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: -0.01em;
      }
      .body { margin: 0.5rem auto 0; max-width: 24rem; color: #5f6368; }
      .tips { margin: 1.25rem auto 0; max-width: 24rem; text-align: left; }
      .tips p { margin: 0; font-weight: 500; color: #202124; }
      .tips ul { margin: 0.5rem 0 0; padding-left: 1.25rem; color: #5f6368; }
      .tips li { margin: 0.35rem 0; }
      .actions { margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; }
      .try {
        border: 0; background: transparent; color: #c5221f; font: inherit; font-weight: 700;
        font-size: 0.9375rem; cursor: pointer; padding: 0.25rem 0.35rem;
      }
      .try:hover { text-decoration: underline; text-underline-offset: 3px; }
      .home { color: #1a73e8; font-weight: 500; text-decoration: none; }
      .home:hover { text-decoration: underline; text-underline-offset: 2px; }
      .game {
        margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e8eaed; text-align: left;
      }
      .game-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; }
      .game-head span:first-child {
        font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #5f6368;
      }
      .game-head span:last-child { font: 500 11px/1 ui-monospace, monospace; color: #80868b; }
      canvas {
        display: block; width: 100%; height: 140px; margin-top: 0.5rem;
        border: 1px solid #dadce0; border-radius: 0.5rem; background: #fafbfd; cursor: pointer;
        touch-action: manipulation;
      }
      .hint { margin: 0.5rem 0 0; text-align: center; font-size: 12px; color: #80868b; }
      .code { margin: 2rem 0 0; font: 400 12px/1 ui-monospace, monospace; letter-spacing: 0.04em; color: #80868b; }
    </style>
  </head>
  <body>
    <div class="wrap" role="alert">
      <svg class="scene" viewBox="0 0 220 160" aria-hidden="true">
        <rect x="36" y="28" width="112" height="100" rx="10" fill="#E8EEF7" stroke="#C5D3E8" stroke-width="1.5"/>
        <rect x="168" y="36" width="28" height="34" rx="4" fill="#F4F7FC" stroke="#8FA3BF" stroke-width="1.5"/>
        <circle cx="177" cy="48" r="2.5" fill="#8FA3BF"/><circle cx="187" cy="48" r="2.5" fill="#8FA3BF"/>
        <rect x="176" y="56" width="12" height="5" rx="1.5" fill="#8FA3BF"/>
        <path d="M182 70 C182 92 156 102 138 108" stroke="#17365D" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M132 104 L148 112 L144 118 L128 110 Z" fill="#2457A6" stroke="#17365D" stroke-width="1"/>
        <rect x="54" y="96" width="52" height="10" rx="2" fill="#2457A6"/>
        <rect x="58" y="86" width="48" height="10" rx="2" fill="#17365D"/>
        <rect x="62" y="76" width="44" height="10" rx="2" fill="#6B8FBF"/>
        <rect x="118" y="98" width="16" height="14" rx="2" fill="#C4A484"/>
        <path d="M126 98 C118 78 132 72 126 98" fill="#2F6B4F"/>
        <path d="M126 98 C134 80 142 86 126 98" fill="#3D8A63"/>
        <circle cx="92" cy="52" r="14" fill="#F8FAFF" stroke="#2457A6" stroke-width="2"/>
        <path d="M86 52 L90 56 L99 47" stroke="#2457A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <ellipse cx="110" cy="142" rx="54" ry="5" fill="#D5DEEC" opacity="0.85"/>
      </svg>
      <p class="brand">${CONNECTION_ERROR_COPY.brand}</p>
      <h1>${CONNECTION_ERROR_COPY.title}</h1>
      <p class="body">${CONNECTION_ERROR_COPY.body}</p>
      <div class="tips">
        <p>${CONNECTION_ERROR_COPY.tryLabel}</p>
        <ul>${tips}</ul>
      </div>
      <div class="actions">
        <button class="try" type="button" id="retry">${CONNECTION_ERROR_COPY.retry}</button>
        <a class="home" href="/">${CONNECTION_ERROR_COPY.home}</a>
      </div>
      <div class="game">
        <div class="game-head"><span>${CONNECTION_ERROR_COPY.gameTitle}</span><span id="hi">HI 0000</span></div>
        <canvas id="dash" width="520" height="140" aria-label="Campus Dash"></canvas>
        <p class="hint">${CONNECTION_ERROR_COPY.gameHint}</p>
      </div>
      <p class="code">${CONNECTION_ERROR_COPY.errorCode}</p>
    </div>
    <script${nonceAttr}>
      window.addEventListener("online", function () { location.reload(); });
      document.getElementById("retry").addEventListener("click", function () { location.reload(); });
      (function () {
        var canvas = document.getElementById("dash");
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext("2d");
        var W = canvas.width, H = canvas.height, ground = H - 24;
        var y = 0, vy = 0, onGround = true, speed = 4.2, dist = 0, frame = 0;
        var running = false, dead = false, obstacles = [], spawnIn = 80, score = 0, best = 0;
        try { best = Number(localStorage.getItem("gpw-campus-dash-best") || 0) || 0; } catch (e) {}
        document.getElementById("hi").textContent = "HI " + String(best).padStart(4, "0");
        function jump() {
          if (dead) {
            y = 0; vy = 0; onGround = true; speed = 4.2; dist = 0; frame = 0;
            obstacles = []; spawnIn = 70; dead = false; running = true; score = 0; return;
          }
          if (!running) running = true;
          if (onGround) { vy = -9.6; onGround = false; }
        }
        window.addEventListener("keydown", function (e) {
          if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
        });
        canvas.addEventListener("pointerdown", function (e) { e.preventDefault(); jump(); });
        function loop() {
          frame++; ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = "#FAFBFD"; ctx.fillRect(0, 0, W, H);
          ctx.strokeStyle = "#C5D3E8"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, ground); ctx.lineTo(W, ground); ctx.stroke();
          if (running && !dead) {
            dist += speed; speed = Math.min(8, speed + 0.0015); score = Math.floor(dist / 12);
            vy += 0.55; y += vy; if (y >= 0) { y = 0; vy = 0; onGround = true; }
            spawnIn--; if (spawnIn <= 0) {
              var kind = Math.floor(Math.random() * 3);
              var h = kind === 0 ? 28 : kind === 1 ? 36 : 22;
              var w = kind === 2 ? 34 : 18;
              obstacles.push({ x: W + 10, w: w, h: h, kind: kind });
              spawnIn = 55 + Math.floor(Math.random() * 50);
            }
            obstacles = obstacles.filter(function (o) { return o.x + o.w > -10; });
            for (var i = 0; i < obstacles.length; i++) {
              var o = obstacles[i]; o.x -= speed;
              var px = 36, py = ground + y;
              if (px < o.x + o.w - 2 && px + 18 > o.x + 2 && py - 38 < ground && py > ground - o.h) {
                dead = true; running = false;
                best = Math.max(best, score);
                try { localStorage.setItem("gpw-campus-dash-best", String(best)); } catch (e) {}
                document.getElementById("hi").textContent = "HI " + String(best).padStart(4, "0") + " · " + String(score).padStart(4, "0");
              }
            }
          }
          for (var j = 0; j < obstacles.length; j++) {
            var ob = obstacles[j], top = ground - ob.h;
            ctx.fillStyle = ob.kind === 1 ? "#8FA3BF" : "#2457A6";
            ctx.fillRect(ob.x, top, ob.w, ob.h);
          }
          var px2 = 36, py2 = ground + y;
          ctx.fillStyle = "#17365D"; ctx.fillRect(px2, py2 - 28, 18, 22);
          ctx.fillStyle = "#2457A6";
          ctx.beginPath(); ctx.moveTo(px2 - 4, py2 - 28); ctx.lineTo(px2 + 9, py2 - 38); ctx.lineTo(px2 + 22, py2 - 28); ctx.fill();
          ctx.fillStyle = "#5F6B7A"; ctx.font = "600 11px system-ui"; ctx.textAlign = "right";
          ctx.fillText(String(score).padStart(4, "0"), W - 12, 18);
          if (!running && !dead) {
            ctx.fillStyle = "#17365D"; ctx.font = "600 13px system-ui"; ctx.textAlign = "center";
            ctx.fillText("Press Space or tap to start", W / 2, H / 2);
          }
          if (dead) {
            ctx.fillStyle = "rgba(250,251,253,0.72)"; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = "#17365D"; ctx.font = "700 14px system-ui"; ctx.textAlign = "center";
            ctx.fillText("Game over — tap to retry", W / 2, H / 2);
          }
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
      })();
    </script>
  </body>
</html>`;
}
