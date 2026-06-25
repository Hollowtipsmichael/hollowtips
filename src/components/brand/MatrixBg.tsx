"use client";

import { useEffect, useRef } from "react";

/**
 * Hollowtips Matrix background — ported from the client's updated
 * "Hollowtips Matrix Background" design handoff (claude.ai/design).
 * Three canvas layers (blurred far rain + bright near rain + gold particles &
 * luminous streaks) with mouse/tilt parallax + a center-darken vignette.
 * Brand letters only (no numbers/symbols). Defaults: Dense / Balanced /
 * Cinematic / Subtle / particles on.
 *
 * Near-rain font kept at 20px (not the design's 28px) per earlier feedback that
 * the larger glyphs read as "zoomed in".
 */
export function MatrixBg() {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const partRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const back = backRef.current, front = frontRef.current, part = partRef.current;
    if (!back || !front || !part) return;
    const bctx = back.getContext("2d")!, fctx = front.getContext("2d")!, pctx = part.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.matchMedia("(max-width:760px)").matches;
    const OVER = 90;
    const WORD = "HOLLOWTIPS";
    const CH = "HOLLOWTIPS".split("");
    const glyph = (cell: number, seed: number, bucket: number) => {
      if (seed < 0) return WORD[((cell % WORD.length) + WORD.length) % WORD.length];
      const h = Math.abs(((cell * 73856093) ^ (seed * 19349663) ^ (bucket * 83492791)) % CH.length);
      return CH[h];
    };

    // config (design defaults)
    const showP = true;
    const densMul = 0.85; // Dense
    const fade = 0.05; // Dense
    const goldBack = 0.08; // Balanced
    const goldFront = 0.33; // Balanced
    const parScale = 1; // Cinematic

    const bfs = isMobile ? 12 : 14;
    const ffs = isMobile ? 16 : 20;
    let W = 0, H = 0, dpr = 1;
    let bCols: any[] = [], fCols: any[] = [], particles: any[] = [], streaks: any[] = [];
    const rng = () => Math.random();

    const resetBack = (c: any) => {
      c.gold = rng() < goldBack;
      c.word = rng() < 0.55;
      c.depth = 0.4 + rng() * 0.6;
      c.v = (0.08 + rng() * 0.16) * (0.6 + c.depth * 0.5);
      const exb = Math.min(1, Math.abs((c.x - W / 2) / (W / 2)));
      c.v *= 0.55 + exb * exb * 0.9;
      c.seed = c.word ? -1 : (rng() * 1e6) | 0;
      c.d = -rng() * (H / bfs) * 0.7;
    };
    const resetFront = (c: any) => {
      c.gold = rng() < goldFront;
      c.word = rng() < 0.78;
      c.trail = 10 + ((rng() * 16) | 0);
      c.alpha = 0.6 + rng() * 0.4;
      c.v = 0.14 + rng() * 0.25;
      const exf = Math.min(1, Math.abs((c.x - W / 2) / (W / 2)));
      c.v *= 0.6 + exf * exf * 0.85;
      c.seed = c.word ? -1 : (rng() * 1e6) | 0;
      c.d = -rng() * 14;
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6);
      W = window.innerWidth + OVER * 2;
      H = window.innerHeight + OVER * 2;
      [back, front, part].forEach((cv) => {
        cv.style.width = W + "px"; cv.style.height = H + "px";
        cv.style.left = -OVER + "px"; cv.style.top = -OVER + "px";
        cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
        cv.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      back.style.filter = isMobile ? "blur(1px)" : "blur(2px)";
      bctx.fillStyle = "#000"; bctx.fillRect(0, 0, W, H);

      const bStep = bfs * densMul;
      const bN = Math.max(1, Math.floor(W / bStep));
      bCols = [];
      for (let i = 0; i < bN; i++) { const c: any = { x: i * bStep + (rng() * bStep * 0.3) }; resetBack(c); c.d = rng() * (H / bfs); bCols.push(c); }

      const fStep = ffs * 1.95 * 0.85; // Dense
      const fN = Math.max(1, Math.floor(W / fStep));
      fCols = [];
      for (let i = 0; i < fN; i++) { const c: any = { x: i * fStep + (rng() - 0.5) * fStep * 0.4 }; resetFront(c); c.d = rng() * (H / ffs); fCols.push(c); }

      const pN = !showP ? 0 : (isMobile ? 38 : 88);
      particles = [];
      for (let i = 0; i < pN; i++) particles.push({
        x: rng() * W, y: rng() * H, vy: -(0.12 + rng() * 0.45), vx: (rng() - 0.5) * 0.18,
        r: 0.9 + rng() * 2.3, a: 0.35 + rng() * 0.55, ph: rng() * 1000,
      });
      streaks = [];
      if (showP) for (let i = 0; i < 4; i++) streaks.push({ x: rng() * W, y: rng() * H, len: 260 + rng() * 240, sp: 2.4 + rng() * 3, life: 0.4 + rng() * 0.6 });
    };

    const drawBack = (t: number) => {
      const bucket = Math.floor(t / 1100);
      bctx.fillStyle = "rgba(0,0,0," + fade + ")";
      bctx.fillRect(0, 0, W, H);
      bctx.textBaseline = "top";
      bctx.font = bfs + "px 'Courier New', ui-monospace, monospace";
      for (const c of bCols) {
        const cell = Math.floor(c.d);
        const y = cell * bfs;
        const ch = glyph(cell, c.seed, bucket);
        if (rng() < 0.02) bctx.fillStyle = "rgba(206,255,224,0.85)";
        else if (c.gold) bctx.fillStyle = "rgba(198,158,74," + (0.72 * c.depth) + ")";
        else bctx.fillStyle = "rgba(22,128,82," + (0.24 + 0.5 * c.depth) + ")";
        bctx.fillText(ch, c.x, y);
        c.d += c.v;
        if (y > H && rng() > 0.965) resetBack(c);
      }
    };

    const drawFront = (t: number) => {
      const bucket = Math.floor(t / 1000);
      fctx.clearRect(0, 0, W, H);
      fctx.textBaseline = "top";
      fctx.font = ffs + "px 'Courier New', ui-monospace, monospace";
      for (const c of fCols) {
        const head = Math.floor(c.d);
        if (c.gold) { fctx.shadowColor = "rgba(246,202,104,0.85)"; fctx.shadowBlur = 14; } else { fctx.shadowColor = "rgba(50,225,140,0.45)"; fctx.shadowBlur = 6; }
        for (let i = 0; i < c.trail; i++) {
          const cell = head - i;
          const y = cell * ffs;
          if (y < -ffs || y > H) continue;
          const a = Math.pow(1 - i / c.trail, 1.35) * c.alpha;
          const ch = glyph(cell, c.seed, bucket);
          if (i === 0) fctx.fillStyle = c.gold ? "rgba(255,248,214," + Math.min(1, c.alpha + 0.15) + ")" : "rgba(232,255,236," + Math.min(1, c.alpha + 0.15) + ")";
          else if (i === 1) fctx.fillStyle = c.gold ? "rgba(252,224,150," + a + ")" : "rgba(150,248,186," + a + ")";
          else fctx.fillStyle = c.gold ? "rgba(226,180,82," + a + ")" : "rgba(28,184,104," + a + ")";
          fctx.fillText(ch, c.x, y);
        }
        c.d += c.v;
        if ((head - c.trail) * ffs > H) resetFront(c);
      }
      fctx.shadowBlur = 0;
    };

    const drawParticles = (t: number) => {
      pctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.y += p.vy; p.x += p.vx + Math.sin((t + p.ph) * 0.0011) * 0.16;
        if (p.y < -12) { p.y = H + 12; p.x = rng() * W; }
        const tw = 0.45 + 0.55 * Math.sin(t * 0.003 + p.ph);
        pctx.beginPath();
        pctx.fillStyle = "rgba(246,206,112," + (p.a * (0.4 + 0.6 * tw)) + ")";
        pctx.shadowColor = "rgba(246,200,100,0.9)";
        pctx.shadowBlur = p.r * 4.5;
        pctx.arc(p.x, p.y, p.r, 0, 6.2832);
        pctx.fill();
      }
      pctx.shadowBlur = 0;
      if (showP && rng() < 0.02 && streaks.length < 6) {
        streaks.push({ x: rng() * W, y: -60, len: 260 + rng() * 240, sp: 2.4 + rng() * 3, life: 1 });
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.y += s.sp; s.life -= 0.0035;
        const f = Math.min(1, s.life * 1.6);
        const g = pctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
        g.addColorStop(0, "rgba(252,226,150,0)");
        g.addColorStop(0.55, "rgba(252,222,140," + (0.35 * f) + ")");
        g.addColorStop(0.92, "rgba(255,238,180," + (0.85 * f) + ")");
        g.addColorStop(1, "rgba(255,250,224," + f + ")");
        pctx.strokeStyle = g; pctx.lineWidth = 2.2; pctx.lineCap = "round";
        pctx.shadowColor = "rgba(250,206,110,0.95)"; pctx.shadowBlur = 14;
        pctx.beginPath(); pctx.moveTo(s.x, s.y - s.len); pctx.lineTo(s.x, s.y); pctx.stroke();
        pctx.shadowBlur = 0;
        // bright glowing head point
        pctx.beginPath();
        pctx.fillStyle = "rgba(255,250,228," + f + ")";
        pctx.shadowColor = "rgba(252,212,120,1)"; pctx.shadowBlur = 22;
        pctx.arc(s.x, s.y, 2.6, 0, 6.2832); pctx.fill();
        pctx.shadowBlur = 0;
        if (s.life <= 0 || s.y - s.len > H) streaks.splice(i, 1);
      }
    };

    // parallax
    let tx = 0, ty = 0, px = 0, py = 0;
    const onMove = (e: MouseEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 35));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
    };
    const applyParallax = (t: number) => {
      const ax = Math.sin(t * 0.00028) * 0.35, ay = Math.cos(t * 0.00022) * 0.3;
      const gx = tx * 0.7 + ax, gy = ty * 0.7 + ay;
      px += (gx - px) * 0.05; py += (gy - py) * 0.05;
      const s = parScale;
      back.style.transform = `translate3d(${px * 8 * s}px, ${py * 6 * s}px, 0)`;
      front.style.transform = `translate3d(${px * 30 * s}px, ${py * 22 * s}px, 0)`;
      part.style.transform = `translate3d(${px * 52 * s}px, ${py * 40 * s}px, 0)`;
    };

    let raf = 0, running = true;
    const loop = (t: number) => {
      if (!running) return;
      drawBack(t); drawFront(t); drawParticles(t); applyParallax(t);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    };
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(build, 180); };

    build();
    if (reduce) {
      for (let i = 0; i < 80; i++) { drawBack(i * 16); drawFront(i * 16); }
      drawParticles(0);
    } else {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("deviceorientation", onTilt);
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("resize", onResize);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <canvas ref={backRef} aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", zIndex: 0, willChange: "transform" }} />
      <canvas ref={frontRef} aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", zIndex: 1, willChange: "transform" }} />
      <canvas ref={partRef} aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", zIndex: 2, willChange: "transform" }} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
          background: "radial-gradient(ellipse 52% 48% at 50% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 32%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
          background: "radial-gradient(ellipse 120% 120% at 50% 50%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}
