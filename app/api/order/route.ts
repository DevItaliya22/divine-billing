import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  order,
  party,
  design,
  fabric,
  fabricColor,
  dori,
  fiveMmSeq,
  threeMmSeq,
  fourMmBeats,
  threeMmBeats,
  twoPointFiveMmBeats,
  orderToFabric,
  orderToFabricColor,
  orderToDori,
  orderToFiveMmSeq,
  orderToThreeMmSeq,
  orderToFourMmBeats,
  orderToThreeMmBeats,
  orderToTwoPointFiveMmBeats,
} from "@/lib/schema";

async function getOrderWithRelations(orderId: string) {
  const orderData = await db.select().from(order).where(eq(order.id, orderId));
  if (!orderData[0]) return null;

  const [partyData] = await db
    .select()
    .from(party)
    .where(eq(party.id, orderData[0].partyId));
  const [designData] = await db
    .select()
    .from(design)
    .where(eq(design.id, orderData[0].designId));

  const fabricIds = await db
    .select({ id: orderToFabric.A })
    .from(orderToFabric)
    .where(eq(orderToFabric.B, orderId));
  const fabricData =
    fabricIds.length > 0
      ? await db
          .select()
          .from(fabric)
          .where(
            inArray(
              fabric.id,
              fabricIds.map((f) => f.id)
            )
          )
      : [];

  const fabricColorIds = await db
    .select({ id: orderToFabricColor.A })
    .from(orderToFabricColor)
    .where(eq(orderToFabricColor.B, orderId));
  const fabricColorData =
    fabricColorIds.length > 0
      ? await db
          .select()
          .from(fabricColor)
          .where(
            inArray(
              fabricColor.id,
              fabricColorIds.map((f) => f.id)
            )
          )
      : [];

  const doriIds = await db
    .select({ id: orderToDori.A })
    .from(orderToDori)
    .where(eq(orderToDori.B, orderId));
  const doriData =
    doriIds.length > 0
      ? await db
          .select()
          .from(dori)
          .where(
            inArray(
              dori.id,
              doriIds.map((d) => d.id)
            )
          )
      : [];

  const fiveMmSeqIds = await db
    .select({ id: orderToFiveMmSeq.A })
    .from(orderToFiveMmSeq)
    .where(eq(orderToFiveMmSeq.B, orderId));
  const fiveMmSeqData =
    fiveMmSeqIds.length > 0
      ? await db
          .select()
          .from(fiveMmSeq)
          .where(
            inArray(
              fiveMmSeq.id,
              fiveMmSeqIds.map((f) => f.id)
            )
          )
      : [];

  const threeMmSeqIds = await db
    .select({ id: orderToThreeMmSeq.A })
    .from(orderToThreeMmSeq)
    .where(eq(orderToThreeMmSeq.B, orderId));
  const threeMmSeqData =
    threeMmSeqIds.length > 0
      ? await db
          .select()
          .from(threeMmSeq)
          .where(
            inArray(
              threeMmSeq.id,
              threeMmSeqIds.map((t) => t.id)
            )
          )
      : [];

  const fourMmBeatsIds = await db
    .select({ id: orderToFourMmBeats.A })
    .from(orderToFourMmBeats)
    .where(eq(orderToFourMmBeats.B, orderId));
  const fourMmBeatsData =
    fourMmBeatsIds.length > 0
      ? await db
          .select()
          .from(fourMmBeats)
          .where(
            inArray(
              fourMmBeats.id,
              fourMmBeatsIds.map((f) => f.id)
            )
          )
      : [];

  const threeMmBeatsIds = await db
    .select({ id: orderToThreeMmBeats.A })
    .from(orderToThreeMmBeats)
    .where(eq(orderToThreeMmBeats.B, orderId));
  const threeMmBeatsData =
    threeMmBeatsIds.length > 0
      ? await db
          .select()
          .from(threeMmBeats)
          .where(
            inArray(
              threeMmBeats.id,
              threeMmBeatsIds.map((t) => t.id)
            )
          )
      : [];

  const twoPointFiveMmBeatsIds = await db
    .select({ id: orderToTwoPointFiveMmBeats.A })
    .from(orderToTwoPointFiveMmBeats)
    .where(eq(orderToTwoPointFiveMmBeats.B, orderId));
  const twoPointFiveMmBeatsData =
    twoPointFiveMmBeatsIds.length > 0
      ? await db
          .select()
          .from(twoPointFiveMmBeats)
          .where(
            inArray(
              twoPointFiveMmBeats.id,
              twoPointFiveMmBeatsIds.map((t) => t.id)
            )
          )
      : [];

  return {
    ...orderData[0],
    partyName: partyData,
    design: designData,
    fabric: fabricData,
    fabricColor: fabricColorData,
    dori: doriData,
    Five_mm_seq: fiveMmSeqData,
    Three_mm_seq: threeMmSeqData,
    Four_mm_beats: fourMmBeatsData,
    Three_mm_beats: threeMmBeatsData,
    Two_point_five_mm_beats: twoPointFiveMmBeatsData,
  };
}

export async function GET() {
  const orders = await db.select().from(order).orderBy(desc(order.createdAt));

  const ordersWithRelations = await Promise.all(
    orders.map((o) => getOrderWithRelations(o.id))
  );

  return NextResponse.json(ordersWithRelations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const orderId = uuidv4();

  const [newOrder] = await db
    .insert(order)
    .values({
      id: orderId,
      orderNumber: body.orderNumber,
      partyId: body.partyId,
      designId: body.designId,
      frame: body.frame || 0,
      notes: body.notes,
    })
    .returning();

  if (body.fabricIds?.length) {
    await db
      .insert(orderToFabric)
      .values(body.fabricIds.map((id: string) => ({ A: id, B: newOrder.id })));
  }

  if (body.fabricColorIds?.length) {
    await db
      .insert(orderToFabricColor)
      .values(
        body.fabricColorIds.map((id: string) => ({ A: id, B: newOrder.id }))
      );
  }

  if (body.doriIds?.length) {
    await db
      .insert(orderToDori)
      .values(body.doriIds.map((id: string) => ({ A: id, B: newOrder.id })));
  }

  if (body.fiveMmSeqIds?.length) {
    await db
      .insert(orderToFiveMmSeq)
      .values(
        body.fiveMmSeqIds.map((id: string) => ({ A: id, B: newOrder.id }))
      );
  }

  if (body.threeMmSeqIds?.length) {
    await db
      .insert(orderToThreeMmSeq)
      .values(
        body.threeMmSeqIds.map((id: string) => ({ A: id, B: newOrder.id }))
      );
  }

  if (body.fourMmBeatsIds?.length) {
    await db
      .insert(orderToFourMmBeats)
      .values(
        body.fourMmBeatsIds.map((id: string) => ({ A: id, B: newOrder.id }))
      );
  }

  if (body.threeMmBeatsIds?.length) {
    await db
      .insert(orderToThreeMmBeats)
      .values(
        body.threeMmBeatsIds.map((id: string) => ({ A: id, B: newOrder.id }))
      );
  }

  if (body.twoPointFiveMmBeatsIds?.length) {
    await db.insert(orderToTwoPointFiveMmBeats).values(
      body.twoPointFiveMmBeatsIds.map((id: string) => ({
        A: id,
        B: newOrder.id,
      }))
    );
  }

  const result = await getOrderWithRelations(newOrder.id);
  return NextResponse.json(result);
}
