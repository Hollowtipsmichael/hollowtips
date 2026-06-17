"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
  fontSize?: number;
  fade?: number;
  speed?: number;
  wordColumnRatio?: number;
}

/**
 * Cinematic "Matrix" code-rain — gold-forward, with depth.
 * Bold, bright "HOLLOWTIPS" columns stand in front (larger, glowing,
 * gap-separated so they read as the word); faint smaller code rains behind;
 * a few intense gold light-beams add drama.
 */
export function MatrixRain({
  className = "",
  opacity = 0.9,
  fontSize = 17,
  fade = 0.075,
  speed = 70,
  wordColumnRatio = 0.32,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GOLD = "#D4AF37";
    const GOLD_BRIGHT = "#FCE38A";
    const GREEN = "#7CFFB2";
    const WORD = "HOLLOWTIPS";
    const GAP = 3;
    const CYCLE = WORD.length + GAP;
    const RAIN_CHARS = "HOLLOWTIPS0123456789".split("");

    let width = 0;
    let height = 0;
    let columns = 0;
    let dpr = 1;
    let frame = 0;

    type Col = {
      word: boolean;
      scale: number; // depth: >1 near (big/bright), <1 far (small/faint)
      alpha: number;
      beam: boolean;
      offset: number;
      drop: number;
      x: number;
    };
    let cols: Col[] = [];

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.max(1, Math.floor(width / fontSize));
      const every = Math.max(2, Math.round(1 / Math.min(0.5, wordColumnRatio)));

      cols = Array.from({ length: columns }, (_, i) => {
        const word = i % every === 1;
        const scale = word
          ? 1.12 + Math.random() * 0.4 // near, bold
          : 0.62 + Math.random() * 0.42; // far → mid
        const alpha = word
          ? 0.92 + Math.random() * 0.08
          : 0.28 + (scale - 0.62) * 0.7;
        return {
          word,
          scale,
          alpha,
          beam: word && scale > 1.35 && Math.random() < 0.5,
          offset: Math.floor(Math.random() * CYCLE),
          drop: Math.floor((Math.random() * -height) / fontSize),
          x: i * fontSize + fontSize / 2,
        };
      });

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      frame++;
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      // pass 1: light-beams behind everything
      for (const col of cols) {
        if (!col.beam) continue;
        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, "rgba(252,227,138,0)");
        g.addColorStop(0.5, "rgba(252,227,138,0.10)");
        g.addColorStop(1, "rgba(252,227,138,0)");
        ctx.fillStyle = g;
        const w = fontSize * col.scale * 1.6;
        ctx.fillRect(col.x - w / 2, 0, w, height);
      }

      // pass 2: glyphs (sorted so near columns draw on top)
      const order = [...cols].sort((a, b) => a.scale - b.scale);
      for (const col of order) {
        const cell = fontSize * col.scale;

        if (col.word) {
          ctx.font = `700 ${cell}px "Courier New", monospace`;
          const rowsN = Math.ceil(height / cell) + 2;
          const lead = Math.floor(frame / 3) % rowsN;
          ctx.globalAlpha = col.alpha;
          for (let r = 0; r < rowsN; r++) {
            const idx = (r + col.offset) % CYCLE;
            if (idx >= WORD.length) continue;
            const ch = WORD[idx];
            if (r === lead) {
              ctx.fillStyle = "#FFFFFF";
              ctx.shadowColor = GOLD_BRIGHT;
              ctx.shadowBlur = 16 * col.scale;
            } else {
              ctx.fillStyle = GOLD_BRIGHT;
              ctx.shadowColor = GOLD;
              ctx.shadowBlur = 8 * col.scale;
            }
            ctx.fillText(ch, col.x, r * cell);
          }
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        } else {
          ctx.font = `${cell}px "Courier New", monospace`;
          const y = col.drop * cell;
          const ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          const rnd = Math.random();
          ctx.globalAlpha = col.alpha;
          if (rnd > 0.99) {
            ctx.fillStyle = GREEN;
            ctx.shadowColor = GREEN;
            ctx.shadowBlur = 6;
          } else if (rnd > 0.92) {
            ctx.fillStyle = GOLD_BRIGHT;
          } else {
            ctx.fillStyle = GOLD;
          }
          ctx.fillText(ch, col.x, y);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          if (y > height && Math.random() > 0.975) col.drop = 0;
          col.drop++;
        }
      }
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let runningFlag = true;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!runningFlag) return;
      if (now - last >= speed) {
        last = now;
        draw();
      }
    };

    setup();
    if (prefersReduced) {
      for (let i = 0; i < 40; i++) draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      runningFlag = document.visibilityState === "visible";
    };
    const onResize = () => setup();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [fontSize, fade, speed, wordColumnRatio]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
