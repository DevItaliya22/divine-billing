import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const parties = await prisma.party.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(parties);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const party = await prisma.party.create({
    data: { name: body.name },
  });
  return NextResponse.json(party);
}
