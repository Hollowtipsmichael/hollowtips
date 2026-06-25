"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage cinematic background: classic Matrix code-rain drawn on canvas
 * (resolution-independent → always sharp). Continuous even green streams
 * spelling HOLLOWTIPS, with gold accent columns, floating gold sparks and
 * occasional gold light-streaks. The page darkens the center so the verify
 * card floats. Uses the translucent-fade technique so columns never have gaps.
 */
export function MatrixBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const GREEN = "#36e06a";
    const GREEN_HEAD = "#c9ffd8";
    const GOLD = "#F5D061";
    const GOLD_HEAD = "#fff2c4";
    const LETTERS = "HOLLOWTIPS";

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, running = true;
    let font = 15;
    type Col = { x: number; y: number; speed: number; gold: boolean; word: boolean; off: number };
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
      font = w < 640 ? 13 : 15;
      const n = Math.ceil(w / font); // one column per glyph width → dense, even
      cols = Array.from({ length: n }, (_, i) => ({
        x: Math.round(i * font + font / 2),
        y: rand(-h, h),
        speed: rand(0.07, 0.16) * h, // gentle; scales with height
        gold: Math.random() < 0.18,
        word: Math.random() < 0.3,
        off: Math.floor(Math.random() * LETTERS.length),
      }));
      const pc = w < 640 ? 12 : 28;
      parts = Array.from({ length: pc }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: rand(0.8, 2.4),
        vy: rand(5, 16), sway: rand(6, 20), ph: Math.random() * 6.28, a: rand(0.3, 0.85),
      }));
      streaks = [];
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    };

    const draw = (dt: number, t: number) => {
      // translucent black → fades previous glyphs into continuous trails
      ctx.fillStyle = "rgba(0,0,0,0.085)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `700 ${font}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const c of cols) {
        const edge = Math.abs(c.x - w / 2) / (w / 2); // 0 center → 1 edge
        c.y += c.speed * (0.85 + edge * 0.4) * dt; // edges slightly faster
        const row = Math.floor(c.y / font);
        const idx = ((row + c.off) % LETTERS.length + LETTERS.length) % LETTERS.length;
        const ch = LETTERS[idx];
        // body glyph (becomes the fading green/gold trail)
        ctx.fillStyle = c.gold ? GOLD : GREEN;
        ctx.fillText(ch, c.x, row * font);
        // bright leading glyph
        ctx.fillStyle = c.gold ? GOLD_HEAD : GREEN_HEAD;
        ctx.shadowColor = c.gold ? GOLD : GREEN;
        ctx.shadowBlur = 6;
        ctx.fillText(ch, c.x, row * font);
        ctx.shadowBlur = 0;
        if (c.y > h && Math.random() > 0.97) {
          c.y = rand(-font * 6, 0);
          c.gold = Math.random() < 0.18;
          c.word = Math.random() < 0.3;
        }
      }

      // occasional gold light-streak
      if (Math.random() < 0.008 && streaks.length < 2) {
        streaks.push({ x: rand(0, w), life: 0, max: rand(0.9, 1.6) });
      }
      for (const s of streaks) {
        s.life += dt;
        const a = Math.sin(Math.min(1, s.life / s.max) * Math.PI) * 0.12;
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

      // floating gold sparks
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
    if (reduce) {
      for (let i = 0; i < 60; i++) draw(0.033, i * 0.033); // settle to a static frame
    } else {
      raf = requestAnimationFrame(loop);
    }
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,70,35,0.18),rgba(0,0,0,0)_70%)]" />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
