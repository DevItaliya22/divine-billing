import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      partyName: true,
      design: true,
      fabric: true,
      fabricColor: true,
      dori: true,
      Five_mm_seq: true,
      Three_mm_seq: true,
      Four_mm_beats: true,
      Three_mm_beats: true,
      Two_point_five_mm_beats: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const order = await prisma.order.create({
    data: {
      orderNumber: body.orderNumber,
      partyId: body.partyId,
      designId: body.designId,
      frame: body.frame || 0,
      notes: body.notes,
      fabric: {
        connect: body.fabricIds?.map((id: string) => ({ id })) || [],
      },
      fabricColor: {
        connect: body.fabricColorIds?.map((id: string) => ({ id })) || [],
      },
      dori: {
        connect: body.doriIds?.map((id: string) => ({ id })) || [],
      },
      Five_mm_seq: {
        connect: body.fiveMmSeqIds?.map((id: string) => ({ id })) || [],
      },
      Three_mm_seq: {
        connect: body.threeMmSeqIds?.map((id: string) => ({ id })) || [],
      },
      Four_mm_beats: {
        connect: body.fourMmBeatsIds?.map((id: string) => ({ id })) || [],
      },
      Three_mm_beats: {
        connect: body.threeMmBeatsIds?.map((id: string) => ({ id })) || [],
      },
      Two_point_five_mm_beats: {
        connect:
          body.twoPointFiveMmBeatsIds?.map((id: string) => ({ id })) || [],
      },
    },
    include: {
      partyName: true,
      design: true,
      fabric: true,
      fabricColor: true,
      dori: true,
      Five_mm_seq: true,
      Three_mm_seq: true,
      Four_mm_beats: true,
      Three_mm_beats: true,
      Two_point_five_mm_beats: true,
    },
  });

  return NextResponse.json(order);
}
