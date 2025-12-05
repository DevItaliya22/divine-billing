import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const party = await prisma.party.update({
    where: { id },
    data: { name: body.name },
  });
  return NextResponse.json(party);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.party.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
