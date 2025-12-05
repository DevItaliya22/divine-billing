import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { party } from "@/lib/schema";

export async function GET() {
  const parties = await db.select().from(party).orderBy(desc(party.createdAt));
  return NextResponse.json(parties);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const [newParty] = await db
    .insert(party)
    .values({ id: uuidv4(), name: body.name })
    .returning();
  return NextResponse.json(newParty);
}
