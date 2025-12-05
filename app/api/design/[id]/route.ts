import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const design = await prisma.design.findUnique({ where: { id } });
  if (!design) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }
  return NextResponse.json(design);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("image") as File | null;

  const updateData: { name?: string; imageUrl?: string; imagePath?: string } =
    {};

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

  const design = await prisma.design.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(design);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.design.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
