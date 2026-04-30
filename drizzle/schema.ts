import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription table - tracks user subscription status and tier
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["free", "premium"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive", "canceled"]).default("active").notNull(),
  renewalDate: timestamp("renewalDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("subscriptions_userId_idx").on(table.userId),
}));

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Module Progress table - tracks user progress across all modules
 */
export const moduleProgress = mysqlTable("moduleProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleName: varchar("moduleName", { length: 100 }).notNull(), // anmeldung, bank, health, visa, integration, tax
  completionPercentage: int("completionPercentage").default(0).notNull(),
  checklistItems: json("checklistItems").$type<Array<{ id: string; label: string; completed: boolean }>>().default([]),
  savedResources: json("savedResources").$type<Array<{ id: string; title: string; url: string }>>().default([]),
  personalNotes: text("personalNotes"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("moduleProgress_userId_idx").on(table.userId),
  userModuleIdx: index("moduleProgress_userId_moduleName_idx").on(table.userId, table.moduleName),
}));

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = typeof moduleProgress.$inferInsert;

/**
 * Anmeldung Office Locations table
 */
export const anmeldungOffices = mysqlTable("anmeldungOffices", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  hours: text("hours"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  cityIdx: index("anmeldungOffices_city_idx").on(table.city),
}));

export type AnmeldungOffice = typeof anmeldungOffices.$inferSelect;
export type InsertAnmeldungOffice = typeof anmeldungOffices.$inferInsert;

/**
 * Bank Recommendations table
 */
export const bankRecommendations = mysqlTable("bankRecommendations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["online", "traditional", "neo-bank"]).notNull(),
  monthlyFee: decimal("monthlyFee", { precision: 8, scale: 2 }),
  accountOpeningBonus: varchar("accountOpeningBonus", { length: 255 }),
  englishSupport: boolean("englishSupport").default(false),
  features: json("features").$type<string[]>().default([]),
  affiliateLink: varchar("affiliateLink", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BankRecommendation = typeof bankRecommendations.$inferSelect;
export type InsertBankRecommendation = typeof bankRecommendations.$inferInsert;

/**
 * Health Insurance Providers table
 */
export const healthInsuranceProviders = mysqlTable("healthInsuranceProviders", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["gkv", "pkv"]).notNull(), // GKV = public, PKV = private
  monthlyContribution: decimal("monthlyContribution", { precision: 8, scale: 2 }),
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  englishSupport: boolean("englishSupport").default(false),
  features: json("features").$type<string[]>().default([]),
  website: varchar("website", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthInsuranceProvider = typeof healthInsuranceProviders.$inferSelect;
export type InsertHealthInsuranceProvider = typeof healthInsuranceProviders.$inferInsert;

/**
 * Integration Courses table
 */
export const integrationCourses = mysqlTable("integrationCourses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  courseType: mysqlEnum("courseType", ["language", "culture", "civic", "combined"]).notNull(),
  startDate: timestamp("startDate"),
  duration: varchar("duration", { length: 100 }), // e.g., "6 months"
  price: decimal("price", { precision: 10, scale: 2 }),
  bamfLink: varchar("bamfLink", { length: 500 }),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  cityIdx: index("integrationCourses_city_idx").on(table.city),
  courseTypeIdx: index("integrationCourses_courseType_idx").on(table.courseType),
}));

export type IntegrationCourse = typeof integrationCourses.$inferSelect;
export type InsertIntegrationCourse = typeof integrationCourses.$inferInsert;

/**
 * Visa Permit Types table
 */
export const visaPermitTypes = mysqlTable("visaPermitTypes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  eligibilityCriteria: json("eligibilityCriteria").$type<string[]>().default([]),
  requiredDocuments: json("requiredDocuments").$type<string[]>().default([]),
  processingTime: varchar("processingTime", { length: 100 }),
  validityPeriod: varchar("validityPeriod", { length: 100 }),
  applicationSteps: json("applicationSteps").$type<Array<{ step: number; description: string }>>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisaPermitType = typeof visaPermitTypes.$inferSelect;
export type InsertVisaPermitType = typeof visaPermitTypes.$inferInsert;