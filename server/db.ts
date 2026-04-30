import { eq, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscriptions, moduleProgress, anmeldungOffices, bankRecommendations, healthInsuranceProviders, integrationCourses, visaPermitTypes } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER & AUTH ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ SUBSCRIPTIONS ============

export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  let result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  
  if (result.length === 0) {
    await db.insert(subscriptions).values({
      userId,
      tier: 'free',
      status: 'active',
    });
    result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  }

  return result[0] || null;
}

export async function updateSubscription(userId: number, data: Partial<typeof subscriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(subscriptions).set(data).where(eq(subscriptions.userId, userId));
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

// ============ MODULE PROGRESS ============

export async function getOrCreateModuleProgress(userId: number, moduleName: string) {
  const db = await getDb();
  if (!db) return null;

  let result = await db.select().from(moduleProgress).where(
    and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleName, moduleName))
  ).limit(1);
  
  if (result.length === 0) {
    await db.insert(moduleProgress).values({
      userId,
      moduleName,
      completionPercentage: 0,
      checklistItems: [],
      savedResources: [],
    });
    result = await db.select().from(moduleProgress).where(
      and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleName, moduleName))
    ).limit(1);
  }

  return result[0] || null;
}

export async function updateModuleProgress(userId: number, moduleName: string, data: Partial<typeof moduleProgress.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(moduleProgress).set(data).where(
    and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleName, moduleName))
  );
  
  const result = await db.select().from(moduleProgress).where(
    and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleName, moduleName))
  ).limit(1);
  return result[0] || null;
}

export async function getUserModuleProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(moduleProgress).where(eq(moduleProgress.userId, userId));
}

// ============ ANMELDUNG OFFICES ============

export async function getAnmeldungOffices(city?: string) {
  const db = await getDb();
  if (!db) return [];

  if (city) {
    return await db.select().from(anmeldungOffices).where(eq(anmeldungOffices.city, city));
  }
  return await db.select().from(anmeldungOffices);
}

export async function getAllCities() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.selectDistinct({ city: anmeldungOffices.city }).from(anmeldungOffices);
  return result.map(r => r.city);
}

// ============ BANK RECOMMENDATIONS ============

export async function getBankRecommendations() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bankRecommendations);
}

// ============ HEALTH INSURANCE PROVIDERS ============

export async function getHealthInsuranceProviders(type?: 'gkv' | 'pkv') {
  const db = await getDb();
  if (!db) return [];

  if (type) {
    return await db.select().from(healthInsuranceProviders).where(eq(healthInsuranceProviders.type, type));
  }
  return await db.select().from(healthInsuranceProviders);
}

// ============ INTEGRATION COURSES ============

export async function getIntegrationCourses(filters?: { city?: string; courseType?: string }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.city) {
    conditions.push(eq(integrationCourses.city, filters.city));
  }
  if (filters?.courseType) {
    conditions.push(eq(integrationCourses.courseType, filters.courseType as any));
  }

  if (conditions.length === 0) {
    return await db.select().from(integrationCourses);
  }
  
  return await db.select().from(integrationCourses).where(and(...conditions));
}

export async function getCourseCities() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.selectDistinct({ city: integrationCourses.city }).from(integrationCourses);
  return result.map(r => r.city);
}

// ============ VISA PERMIT TYPES ============

export async function getVisaPermitTypes() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(visaPermitTypes);
}

export async function getVisaPermitByCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(visaPermitTypes).where(eq(visaPermitTypes.code, code)).limit(1);
  return result[0] || null;
}
