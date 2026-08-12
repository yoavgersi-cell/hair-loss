import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "topweight2026";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || auth.replace("Bearer ", "") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const blob = await put(`uploads/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
