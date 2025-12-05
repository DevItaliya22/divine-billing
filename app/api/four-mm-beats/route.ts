import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { fourMmBeats } from "@/lib/schema";

export async function GET() {
  const items = await db
    .select()
    .from(fourMmBeats)
    .orderBy(desc(fourMmBeats.createdAt));
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const [newItem] = await db
    .insert(fourMmBeats)
    .values({ id: uuidv4(), name: body.name })
    .returning();
  return NextResponse.json(newItem);
}
