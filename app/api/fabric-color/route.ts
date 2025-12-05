import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { fabricColor } from "@/lib/schema";

export async function GET() {
  const colors = await db
    .select()
    .from(fabricColor)
    .orderBy(desc(fabricColor.createdAt));
  return NextResponse.json(colors);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const [newColor] = await db
    .insert(fabricColor)
    .values({ id: uuidv4(), name: body.name })
    .returning();
  return NextResponse.json(newColor);
}
