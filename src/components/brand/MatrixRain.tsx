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
 * Some columns stand STILL and boldly spell "HOLLOWTIPS" top-to-bottom
 * (readable), while the rest RUN as dimmer falling code, with occasional
 * green glints and a few bright gold vertical light-streaks.
 *
 * DPR-aware, time-based stepping, pauses when hidden, honours reduced-motion.
 */
export function MatrixRain({
  className = "",
  opacity = 0.5,
  fontSize = 16,
  fade = 0.09,
  speed = 60,
  wordColumnRatio = 0.25,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GOLD = "#D4AF37";
    const GOLD_BRIGHT = "#F5D061";
    const GOLD_DIM = "#8a6f1f";
    const GREEN = "#7CFFB2";
    const WORD = "HOLLOWTIPS";
    const RAIN_CHARS = "HOLLOWTIPS0123456789".split("");

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let dpr = 1;
    let frame = 0;

    type Col = {
      word: boolean; // static HOLLOWTIPS column
      drop: number; // head row (rain columns)
      streak: boolean; // gold light-beam behind a word column
      offset: number; // vertical phase for word letters
      bright: number; // per-column brightness 0.5–1
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
      rows = Math.ceil(height / fontSize) + 1;

      cols = Array.from({ length: columns }, () => {
        const word = Math.random() < wordColumnRatio;
        return {
          word,
          drop: Math.floor((Math.random() * -height) / fontSize),
          streak: word && Math.random() < 0.35,
          offset: Math.floor(Math.random() * WORD.length),
          bright: 0.5 + Math.random() * 0.5,
        };
      });

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      frame++;
      // Fade previous frame (creates trails for running columns).
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "top";

      for (let i = 0; i < columns; i++) {
        const col = cols[i];
        const x = i * fontSize;

        if (col.word) {
          // Faint gold light-beam behind some word columns.
          if (col.streak) {
            ctx.fillStyle = "rgba(245, 208, 97, 0.05)";
            ctx.fillRect(x - 1, 0, fontSize + 2, height);
          }
          // Static, bold, readable HOLLOWTIPS down the whole column.
          ctx.font = `700 ${fontSize}px "Courier New", monospace`;
          // gentle shimmer so it's alive but still readable
          const pulse = 0.8 + 0.2 * Math.sin(frame / 18 + i);
          for (let r = 0; r < rows; r++) {
            const ch = WORD[(r + col.offset) % WORD.length];
            // one slowly-moving bright lead glyph per word column
            const lead = (frame / 6 + col.offset) % rows;
            const isLead = Math.abs(r - lead) < 0.6;
            if (isLead) {
              ctx.fillStyle = GOLD_BRIGHT;
              ctx.shadowColor = GOLD_BRIGHT;
              ctx.shadowBlur = 12;
            } else {
              ctx.globalAlpha = col.bright * pulse;
              ctx.fillStyle = col.streak ? GOLD_BRIGHT : GOLD;
              ctx.shadowColor = GOLD;
              ctx.shadowBlur = 6;
            }
            ctx.fillText(ch, x, r * fontSize);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          }
        } else {
          // Running rain — dimmer background.
          ctx.font = `${fontSize}px "Courier New", monospace`;
          const y = col.drop * fontSize;
          const ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          const r = Math.random();
          if (r > 0.992) {
            ctx.fillStyle = GREEN; // rare green glint
            ctx.shadowColor = GREEN;
            ctx.shadowBlur = 6;
          } else if (r > 0.95) {
            ctx.globalAlpha = col.bright;
            ctx.fillStyle = GOLD; // brighter lead
          } else {
            ctx.globalAlpha = col.bright * 0.55;
            ctx.fillStyle = GOLD_DIM;
          }
          ctx.fillText(ch, x, y);
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
      for (let i = 0; i < 30; i++) draw(); // static readable frame
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
