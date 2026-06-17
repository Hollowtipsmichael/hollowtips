"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  /** Overall opacity of the canvas (0–1). */
  opacity?: number;
  /** Column font size in px (also controls density). */
  fontSize?: number;
  /** Fade strength of the running-rain trail (higher = shorter trails). */
  fade?: number;
  /** Milliseconds between rain steps (higher = slower fall). */
  speed?: number;
  /** Fraction of columns that stand still and spell HOLLOWTIPS (0–1). */
  wordColumnRatio?: number;
}

/**
 * Cinematic "Matrix" code-rain backdrop — gold-forward.
 * Some columns stand STILL and clearly spell "HOLLOWTIPS" top-to-bottom
 * (bold, bright, gap-separated so it reads as the word), while the rest RUN
 * as falling code with occasional green glints.
 */
export function MatrixRain({
  className = "",
  opacity = 0.7,
  fontSize = 18,
  fade = 0.08,
  speed = 70,
  wordColumnRatio = 0.3,
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
    const GAP = 3; // blank rows between word repeats so the word is readable
    const CYCLE = WORD.length + GAP;
    const RAIN_CHARS = "HOLLOWTIPS0123456789".split("");

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let dpr = 1;
    let frame = 0;

    type Col = {
      word: boolean;
      drop: number;
      offset: number;
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
      rows = Math.ceil(height / fontSize) + 2;

      // Evenly space the static word columns so they don't clump.
      const every = Math.max(2, Math.round(1 / Math.min(0.5, wordColumnRatio)));
      cols = Array.from({ length: columns }, (_, i) => ({
        word: i % every === 1,
        drop: Math.floor((Math.random() * -height) / fontSize),
        offset: Math.floor(Math.random() * CYCLE),
      }));

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      frame++;
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      for (let i = 0; i < columns; i++) {
        const col = cols[i];
        const cx = i * fontSize + fontSize / 2;

        if (col.word) {
          // Static, bold, bright HOLLOWTIPS — clearly readable, gap-separated.
          ctx.font = `700 ${fontSize}px "Courier New", monospace`;
          // one bright lead glyph slides down for life
          const lead = Math.floor(frame / 3) % rows;
          for (let r = 0; r < rows; r++) {
            const idx = (r + col.offset) % CYCLE;
            if (idx >= WORD.length) continue; // gap row → blank
            const ch = WORD[idx];
            if (r === lead) {
              ctx.fillStyle = "#FFFFFF";
              ctx.shadowColor = GOLD_BRIGHT;
              ctx.shadowBlur = 14;
            } else {
              ctx.fillStyle = GOLD_BRIGHT;
              ctx.shadowColor = GOLD;
              ctx.shadowBlur = 8;
            }
            ctx.fillText(ch, cx, r * fontSize);
          }
          ctx.shadowBlur = 0;
        } else {
          // Running rain — visible but secondary.
          ctx.font = `${fontSize}px "Courier New", monospace`;
          const y = col.drop * fontSize;
          const ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          const r = Math.random();
          if (r > 0.99) {
            ctx.fillStyle = GREEN;
            ctx.shadowColor = GREEN;
            ctx.shadowBlur = 8;
          } else if (r > 0.9) {
            ctx.fillStyle = GOLD_BRIGHT; // bright lead
            ctx.shadowColor = GOLD;
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = GOLD;
          }
          ctx.fillText(ch, cx, y);
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
