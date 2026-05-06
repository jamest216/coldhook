// ── Install dependencies ──
//   npm install drizzle-orm postgres
//   npm install -D drizzle-kit
//
// ── Required env var in .env.local ──
//   DATABASE_URL=postgresql://... (Supabase → Settings → Database → Connection string → URI, use Transaction pooler)

import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientCompany: text("recipient_company").notNull(),
  recipientTitle: text("recipient_title"),
  linkedinUrl: text("linkedin_url"),
  triggerContext: text("trigger_context"),
  valueProp: text("value_prop"),
  tone: text("tone"),
  score: integer("score"),
  status: text("status", { enum: ["sent", "opened", "replied", "bounced"] })
    .notNull()
    .default("sent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prospects = pgTable("prospects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company").notNull(),
  industry: text("industry"),
  linkedinUrl: text("linkedin_url"),
  triggerSignal: text("trigger_signal"),
  score: integer("score"),
  status: text("status", { enum: ["hot", "warm", "cool"] })
    .notNull()
    .default("warm"),
  emailsSent: integer("emails_sent").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type Prospect = typeof prospects.$inferSelect;
export type NewProspect = typeof prospects.$inferInsert;
