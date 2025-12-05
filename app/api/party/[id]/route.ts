import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { party } from "@/lib/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const [updated] = await db
    .update(party)
    .set({ name: body.name, updatedAt: new Date() })
    .where(eq(party.id, id))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(party).where(eq(party.id, id));
  return NextResponse.json({ success: true });
}
