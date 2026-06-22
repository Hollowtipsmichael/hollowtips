import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveUpload, UploadError, type UploadKind } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data." },
      { status: 400 },
    );
  }
  const file = form.get("file");
  const kind = (form.get("kind") as string) || "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (kind !== "image" && kind !== "video" && kind !== "file") {
    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  }

  try {
    const { url } = await saveUpload(file, kind as UploadKind);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
