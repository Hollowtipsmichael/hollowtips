import { spawn } from "node:child_process";
import { rename, stat, unlink } from "node:fs/promises";
import path from "node:path";

/**
 * Web-optimize an uploaded video in place: cap to 1080p, H.264 CRF 21
 * (near-lossless at screen size), +faststart (instant playback), keep audio.
 * Safe: if ffmpeg is missing or the encode fails, the original file is left
 * untouched so uploads never break.
 */
export async function optimizeVideo(absPath: string): Promise<void> {
  // Skip tiny files that are almost certainly already web-friendly.
  try {
    const s = await stat(absPath);
    if (s.size < 3 * 1024 * 1024) return; // < 3MB → leave as-is
  } catch {
    return;
  }

  const dir = path.dirname(absPath);
  const ext = path.extname(absPath);
  const tmp = path.join(dir, `.opt-${Date.now()}${ext || ".mp4"}`);

  const args = [
    "-y",
    "-i", absPath,
    "-vf", "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'",
    "-c:v", "libx264",
    "-crf", "21",
    "-preset", "veryfast",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "128k",
    tmp,
  ];

  const ok = await new Promise<boolean>((resolve) => {
    let proc;
    try {
      proc = spawn("ffmpeg", args, { stdio: "ignore" });
    } catch {
      resolve(false);
      return;
    }
    proc.on("error", () => resolve(false)); // ffmpeg not installed
    proc.on("close", (code) => resolve(code === 0));
  });

  if (!ok) {
    await unlink(tmp).catch(() => {});
    return; // keep original
  }

  try {
    // Only replace if the optimized file is valid and not larger.
    const [orig, opt] = await Promise.all([stat(absPath), stat(tmp)]);
    if (opt.size > 0 && opt.size <= orig.size) {
      await rename(tmp, absPath);
    } else {
      await unlink(tmp).catch(() => {});
    }
  } catch {
    await unlink(tmp).catch(() => {});
  }
}
