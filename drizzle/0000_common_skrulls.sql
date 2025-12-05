CREATE TABLE "Design" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"imageUrl" text NOT NULL,
	"imagePath" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Dori" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Fabric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "FabricColor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Five_mm_seq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Four_mm_beats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderNumber" varchar(255) NOT NULL,
	"orderDate" timestamp DEFAULT now() NOT NULL,
	"partyId" uuid NOT NULL,
	"designId" uuid NOT NULL,
	"frame" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToDori" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToFabric" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToFabricColor" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToFive_mm_seq" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToFour_mm_beats" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToThree_mm_beats" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToThree_mm_seq" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_OrderToTwo_point_five_mm_beats" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Party" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Three_mm_beats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Three_mm_seq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Two_point_five_mm_beats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_partyId_Party_id_fk" FOREIGN KEY ("partyId") REFERENCES "public"."Party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_designId_Design_id_fk" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToDori" ADD CONSTRAINT "_OrderToDori_A_Dori_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Dori"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToDori" ADD CONSTRAINT "_OrderToDori_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFabric" ADD CONSTRAINT "_OrderToFabric_A_Fabric_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Fabric"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFabric" ADD CONSTRAINT "_OrderToFabric_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFabricColor" ADD CONSTRAINT "_OrderToFabricColor_A_FabricColor_id_fk" FOREIGN KEY ("A") REFERENCES "public"."FabricColor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFabricColor" ADD CONSTRAINT "_OrderToFabricColor_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFive_mm_seq" ADD CONSTRAINT "_OrderToFive_mm_seq_A_Five_mm_seq_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Five_mm_seq"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFive_mm_seq" ADD CONSTRAINT "_OrderToFive_mm_seq_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFour_mm_beats" ADD CONSTRAINT "_OrderToFour_mm_beats_A_Four_mm_beats_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Four_mm_beats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToFour_mm_beats" ADD CONSTRAINT "_OrderToFour_mm_beats_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToThree_mm_beats" ADD CONSTRAINT "_OrderToThree_mm_beats_A_Three_mm_beats_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Three_mm_beats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToThree_mm_beats" ADD CONSTRAINT "_OrderToThree_mm_beats_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToThree_mm_seq" ADD CONSTRAINT "_OrderToThree_mm_seq_A_Three_mm_seq_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Three_mm_seq"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToThree_mm_seq" ADD CONSTRAINT "_OrderToThree_mm_seq_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToTwo_point_five_mm_beats" ADD CONSTRAINT "_OrderToTwo_point_five_mm_beats_A_Two_point_five_mm_beats_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Two_point_five_mm_beats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_OrderToTwo_point_five_mm_beats" ADD CONSTRAINT "_OrderToTwo_point_five_mm_beats_B_Order_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;