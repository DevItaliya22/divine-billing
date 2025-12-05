import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { design } from "@/lib/schema";
import { uploadToS3 } from "@/lib/s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [result] = await db.select().from(design).where(eq(design.id, id));
  if (!result) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("image") as File | null;

  const updateData: {
    name?: string;
    imageUrl?: string;
    imagePath?: string;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (name) {
    updateData.name = name;
  }

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const imageUrl = await uploadToS3(buffer, fileName, id, file.type);
    updateData.imageUrl = imageUrl;
    updateData.imagePath = `divine/${id}/${fileName}`;
  }

  const [updated] = await db
    .update(design)
    .set(updateData)
    .where(eq(design.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(design).where(eq(design.id, id));
  return NextResponse.json({ success: true });
}
