import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { threeMmBeats } from "@/lib/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(threeMmBeats)
    .set({ name: body.name, updatedAt: new Date() })
    .where(eq(threeMmBeats.id, id))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(threeMmBeats).where(eq(threeMmBeats.id, id));
  return NextResponse.json({ success: true });
}
