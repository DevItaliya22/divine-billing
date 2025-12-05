import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const colors = await prisma.fabricColor.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(colors);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const color = await prisma.fabricColor.create({
    data: { name: body.name },
  });
  return NextResponse.json(color);
}
