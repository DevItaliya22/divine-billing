import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const color = await prisma.fabricColor.update({
    where: { id },
    data: { name: body.name },
  });
  return NextResponse.json(color);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.fabricColor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
