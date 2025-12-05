import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
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

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      orderNumber: body.orderNumber,
      partyId: body.partyId,
      designId: body.designId,
      frame: body.frame,
      notes: body.notes,
      fabric: {
        set: body.fabricIds?.map((fid: string) => ({ id: fid })) || [],
      },
      fabricColor: {
        set: body.fabricColorIds?.map((fid: string) => ({ id: fid })) || [],
      },
      dori: {
        set: body.doriIds?.map((fid: string) => ({ id: fid })) || [],
      },
      Five_mm_seq: {
        set: body.fiveMmSeqIds?.map((fid: string) => ({ id: fid })) || [],
      },
      Three_mm_seq: {
        set: body.threeMmSeqIds?.map((fid: string) => ({ id: fid })) || [],
      },
      Four_mm_beats: {
        set: body.fourMmBeatsIds?.map((fid: string) => ({ id: fid })) || [],
      },
      Three_mm_beats: {
        set: body.threeMmBeatsIds?.map((fid: string) => ({ id: fid })) || [],
      },
      Two_point_five_mm_beats: {
        set:
          body.twoPointFiveMmBeatsIds?.map((fid: string) => ({ id: fid })) ||
          [],
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
