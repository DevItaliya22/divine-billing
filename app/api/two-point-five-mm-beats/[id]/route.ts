import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { twoPointFiveMmBeats } from "@/lib/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(twoPointFiveMmBeats)
    .set({ name: body.name, updatedAt: new Date() })
    .where(eq(twoPointFiveMmBeats.id, id))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(twoPointFiveMmBeats).where(eq(twoPointFiveMmBeats.id, id));
  return NextResponse.json({ success: true });
}
