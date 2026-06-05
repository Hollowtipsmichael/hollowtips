"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  /** Overall opacity of the canvas (0–1). */
  opacity?: number;
  /** Column font size in px (also controls density). */
  fontSize?: number;
  /** Fade strength of the trail (higher = shorter trails). */
  fade?: number;
  /** Milliseconds between rain steps (higher = slower fall). */
  speed?: number;
}

/**
 * Cinematic "Matrix" code-rain backdrop.
 * Gold-forward with occasional neon-green glints, glyphs spell out
 * "HOLLOWTIPS" falling down the screen. Used as the login hero backdrop.
 *
 * - DPR-aware, requestAnimationFrame loop with a time-based step (speed)
 * - Pauses when the tab is hidden
 * - Honours prefers-reduced-motion (renders a single faint static frame)
 */
export function MatrixRain({
  className = "",
  opacity = 0.5,
  fontSize = 16,
  fade = 0.08,
  speed = 45,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GOLD = "#D4AF37";
    const GOLD_BRIGHT = "#F5D061";
    const GREEN = "#7CFFB2";
    // Columns stream the word "HOLLOWTIPS" letter-by-letter as they fall.
    const WORD = "HOLLOWTIPS";

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let dpr = 1;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / fontSize),
      );
      // Solid black base
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      // Translucent black to fade previous frame → trails
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < columns; i++) {
        const row = drops[i];
        // Letter chosen by row so the column reads H-O-L-L-O-W-T-I-P-S downward.
        const char = WORD[((row % WORD.length) + WORD.length) % WORD.length];
        const x = i * fontSize;
        const y = row * fontSize;

        const r = Math.random();
        // Mostly gold; rare bright lead glyph; rarer green glint
        if (r > 0.985) {
          ctx.fillStyle = GREEN;
          ctx.shadowColor = GREEN;
          ctx.shadowBlur = 8;
        } else if (r > 0.93) {
          ctx.fillStyle = GOLD_BRIGHT;
          ctx.shadowColor = GOLD_BRIGHT;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = GOLD;
          ctx.shadowBlur = 0;
        }
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let running = true;
    let last = 0;

    // Time-based stepping so the fall speed is independent of refresh rate.
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      if (now - last >= speed) {
        last = now;
        draw();
      }
    };

    setup();

    if (prefersReduced) {
      // Render a few static frames for a faint glyph field, then stop.
      for (let i = 0; i < 30; i++) draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    const onResize = () => setup();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [fontSize, fade, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
