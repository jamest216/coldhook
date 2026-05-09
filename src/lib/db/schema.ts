// ── Install dependencies ──
//   npm install drizzle-orm postgres
//   npm install -D drizzle-kit
//
// ── Required env var in .env.local ──
//   DATABASE_URL=postgresql://... (Supabase → Settings → Database → Connection string → URI, use Transaction pooler)

import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const userSettings = pgTable("user_settings", {
  // Primary key is the Clerk userId — one row per user, no uuid needed
  userId: text("user_id").primaryKey(),

  // ── Sender identity (pre-fills compose + passed to generate API) ──────
  senderValueProp:   text("sender_value_prop"),   // "I help [ICP] achieve [outcome]..."
  senderTitle:       text("sender_title"),         // user's own job title
  senderCompany:     text("sender_company"),       // user's own company
  senderLinkedinUrl: text("sender_linkedin_url"),

  // ── Email defaults (pre-fill compose selectors) ───────────────────────
  defaultTone:     text("default_tone").default("conversational"),
  defaultLength:   text("default_length").default("medium"),
  defaultCtaStyle: text("default_cta_style").default("soft"),
  defaultIndustry: text("default_industry").default("tech_saas"),

  // ── AI feature toggles ────────────────────────────────────────────────
  includeSocialProof:      boolean("include_social_proof").default(true),
  emojiInSubjects:         boolean("emoji_in_subjects").default(true),
  personalizationFromNews: boolean("personalization_from_news").default(true),
  spamScoreCheck:          boolean("spam_score_check").default(true),
  autoAbSubjects:          boolean("auto_ab_subjects").default(false),

  // ── Notification prefs ────────────────────────────────────────────────
  notifyOnReply:       boolean("notify_on_reply").default(true),
  notifyWeeklySummary: boolean("notify_weekly_summary").default(true),
  notifyBuyingSignal:  boolean("notify_buying_signal").default(true),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const templates = pgTable("templates", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      text("user_id").notNull(),
  name:        text("name").notNull(),
  category:    text("category").notNull().default("Custom"),
  description: text("description"),
  subject:     text("subject").notNull(),
  body:        text("body").notNull(),
  tone:        text("tone").default("conversational"),
  tags:        text("tags").array().default([]),
  starred:     boolean("starred").notNull().default(false),
  uses:        integer("uses").notNull().default(0),
  // replyRate left null until email tracking infrastructure exists
  replyRate:   integer("reply_rate"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
  updatedAt:   timestamp("updated_at").notNull().defaultNow(),
});

export type Email           = typeof emails.$inferSelect;
export type NewEmail        = typeof emails.$inferInsert;
export type Prospect        = typeof prospects.$inferSelect;
export type NewProspect     = typeof prospects.$inferInsert;
export type UserSettings    = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type Template        = typeof templates.$inferSelect;
export type NewTemplate     = typeof templates.$inferInsert;
