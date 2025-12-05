import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const items = await prisma.five_mm_seq.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const item = await prisma.five_mm_seq.create({
    data: { name: body.name },
  });
  return NextResponse.json(item);
}
