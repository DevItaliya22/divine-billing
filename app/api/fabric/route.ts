import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const fabrics = await prisma.fabric.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(fabrics);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const fabric = await prisma.fabric.create({
    data: { name: body.name },
  });
  return NextResponse.json(fabric);
}
