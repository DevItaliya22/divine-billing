import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const party = pgTable("Party", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const design = pgTable("Design", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imagePath: text("imagePath").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const fabric = pgTable("Fabric", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const fabricColor = pgTable("FabricColor", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const dori = pgTable("Dori", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const fiveMmSeq = pgTable("Five_mm_seq", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const threeMmSeq = pgTable("Three_mm_seq", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const fourMmBeats = pgTable("Four_mm_beats", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const threeMmBeats = pgTable("Three_mm_beats", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const twoPointFiveMmBeats = pgTable("Two_point_five_mm_beats", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const order = pgTable("Order", {
  id: text("id").primaryKey(),
  orderNumber: text("orderNumber").notNull(),
  orderDate: timestamp("orderDate", { mode: "date" }).notNull().defaultNow(),
  partyId: text("partyId").notNull(),
  designId: text("designId").notNull(),
  frame: integer("frame").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Junction tables - no FK refs since Prisma already created them
export const orderToFabric = pgTable("_OrderToFabric", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToFabricColor = pgTable("_OrderToFabricColor", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToDori = pgTable("_OrderToDori", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToFiveMmSeq = pgTable("_OrderToFive_mm_seq", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToThreeMmSeq = pgTable("_OrderToThree_mm_seq", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToFourMmBeats = pgTable("_OrderToFour_mm_beats", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToThreeMmBeats = pgTable("_OrderToThree_mm_beats", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});

export const orderToTwoPointFiveMmBeats = pgTable(
  "_OrderToTwo_point_five_mm_beats",
  {
    A: text("A").notNull(),
    B: text("B").notNull(),
  }
);

// Relations
export const partyRelations = relations(party, ({ many }) => ({
  orders: many(order),
}));

export const designRelations = relations(design, ({ many }) => ({
  orders: many(order),
}));

export const orderRelations = relations(order, ({ one }) => ({
  partyName: one(party, {
    fields: [order.partyId],
    references: [party.id],
  }),
  design: one(design, {
    fields: [order.designId],
    references: [design.id],
  }),
}));
