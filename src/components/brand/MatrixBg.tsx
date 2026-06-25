"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage cinematic background: the client's matrix wallpaper IMAGE as the
 * base (clean green code-rain + gold), with a transparent canvas overlay that
 * adds LIVE motion — falling green/gold code, floating gold particles, and
 * occasional gold light-streaks. Loops forever, mobile-friendly. The page
 * darkens the center on top so the verify card floats (and the image's logo
 * reads only as ambient rain at the edges).
 */
export function MatrixBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // static image only

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GREEN = "#39ff14";
    const GREEN_DIM = "#1faa59";
    const GOLD = "#F5D061";
    const GOLD_DIM = "#D4AF37";
    const GLYPHS = "HOLLOWTIPS0123456789".split("");

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, running = true;
    let font = 16;
    type Col = { x: number; y: number; speed: number; gold: boolean; trail: number; word: boolean; off: number };
    type P = { x: number; y: number; r: number; vy: number; sway: number; ph: number; a: number };
    type Streak = { x: number; life: number; max: number };
    let cols: Col[] = [];
    let parts: P[] = [];
    let streaks: Streak[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      font = w < 640 ? 15 : 17;
      const gap = font * 1.35; // denser
      const n = Math.floor(w / gap);
      cols = Array.from({ length: n }, (_, i) => ({
        x: Math.round(i * gap + gap / 2),
        y: rand(-h, 0),
        // speed scales with viewport height so it doesn't crawl on tall desktops
        speed: rand(0.22, 0.5) * h, // px/sec; radial scaling applied per-frame
        gold: Math.random() < 0.22,
        trail: Math.floor(rand(8, 18)),
        word: Math.random() < 0.18,
        off: Math.floor(Math.random() * 10),
      }));
      const pc = w < 640 ? 16 : 40;
      parts = Array.from({ length: pc }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: rand(0.8, 2.6),
        vy: rand(6, 22), sway: rand(6, 22), ph: Math.random() * 6.28, a: rand(0.25, 0.85),
      }));
      streaks = [];
    };

    const cx = () => w / 2;

    const draw = (dt: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `700 ${font}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // falling code columns (parallax: slower near center, faster at edges)
      for (const c of cols) {
        const edge = Math.abs(c.x - cx()) / (w / 2); // 0 center → 1 edge
        const sp = c.speed * (0.8 + edge * 0.6); // center a touch slower, edges faster
        c.y += sp * dt;
        if (c.y - c.trail * font > h) {
          c.y = rand(-h * 0.5, 0);
          c.gold = Math.random() < 0.22;
        }
        const base = c.gold ? GOLD_DIM : GREEN_DIM;
        const lead = c.gold ? GOLD : GREEN;
        for (let k = 0; k < c.trail; k++) {
          const yy = c.y - k * font;
          if (yy < -font || yy > h + font) continue;
          const ch = c.word
            ? "HOLLOWTIPS"[(Math.floor(yy / font) + c.off) % 10]
            : GLYPHS[(Math.floor(yy / font) + c.off + k) % GLYPHS.length];
          if (k === 0) {
            ctx.fillStyle = "#eafff0";
            ctx.shadowColor = lead;
            ctx.shadowBlur = 10;
          } else {
            ctx.globalAlpha = Math.max(0, 1 - k / c.trail) * (c.gold ? 0.8 : 0.7);
            ctx.fillStyle = k < 3 ? lead : base;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(ch, c.x, yy);
          ctx.globalAlpha = 1;
        }
        ctx.shadowBlur = 0;
      }

      // occasional gold light streak
      if (Math.random() < 0.01 && streaks.length < 3) {
        streaks.push({ x: rand(0, w), life: 0, max: rand(0.9, 1.7) });
      }
      for (const s of streaks) {
        s.life += dt;
        const a = Math.sin(Math.min(1, s.life / s.max) * Math.PI) * 0.14;
        if (a > 0) {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "rgba(245,208,97,0)");
          g.addColorStop(0.5, `rgba(245,208,97,${a})`);
          g.addColorStop(1, "rgba(245,208,97,0)");
          ctx.fillStyle = g;
          ctx.fillRect(s.x - 1.5, 0, 3, h);
        }
      }
      streaks = streaks.filter((s) => s.life < s.max);

      // floating gold particles (independent)
      for (const p of parts) {
        p.y -= p.vy * dt; p.ph += dt;
        const x = p.x + Math.sin(p.ph) * p.sway;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + p.ph);
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = `rgba(245,224,140,${p.a * tw})`;
        ctx.shadowColor = "rgba(212,175,55,0.9)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      if (now - last >= 33) { draw(dt, now / 1000); last = now; }
    };

    const onVis = () => { running = document.visibilityState === "visible"; last = 0; };
    const onResize = () => setup();
    setup();
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* base: client's matrix wallpaper, slow drift for life */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat [animation:ht-bgdrift_28s_ease-in-out_infinite] motion-reduce:animate-none"
        style={{
          backgroundImage: "url(/brand/matrix-poster.jpg)",
          filter: "brightness(1.05) saturate(1.15)",
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
