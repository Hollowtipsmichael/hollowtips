import QRCode from "qrcode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyUrl } from "@/lib/code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const code = await prisma.verificationCode.findUnique({ where: { id } });
  if (!code) return new Response("Not found", { status: 404 });

  const base = process.env.NEXTAUTH_URL || url.origin;
  const png = await QRCode.toBuffer(verifyUrl(code.code, base), {
    errorCorrectionLevel: "H",
    width: 600,
    margin: 2,
    color: { dark: "#0A0A0A", light: "#FFFFFF" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${code.code}.png"`,
    },
  });
}
