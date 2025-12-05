import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const designs = await prisma.design.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(designs);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("image") as File | null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const designId = uuidv4();
  let imageUrl = "";
  let imagePath = "";

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    imageUrl = await uploadToS3(buffer, fileName, designId, file.type);
    imagePath = `divine/${designId}/${fileName}`;
  }

  const design = await prisma.design.create({
    data: {
      id: designId,
      name,
      imageUrl,
      imagePath,
    },
  });

  return NextResponse.json(design);
}
