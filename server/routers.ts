import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ SUBSCRIPTIONS ============
  subscription: router({
    getOrCreate: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrCreateSubscription(ctx.user.id);
    }),
    update: protectedProcedure.input(z.object({
      tier: z.enum(['free', 'premium']).optional(),
      stripeCustomerId: z.string().optional(),
      stripeSubscriptionId: z.string().optional(),
      status: z.enum(['active', 'inactive', 'canceled']).optional(),
      renewalDate: z.date().optional(),
    })).mutation(async ({ ctx, input }) => {
      return await db.updateSubscription(ctx.user.id, input);
    }),
  }),

  // ============ MODULE PROGRESS ============
  moduleProgress: router({
    get: protectedProcedure.input(z.object({
      moduleName: z.string(),
    })).query(async ({ ctx, input }) => {
      return await db.getOrCreateModuleProgress(ctx.user.id, input.moduleName);
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserModuleProgress(ctx.user.id);
    }),
    
    update: protectedProcedure.input(z.object({
      moduleName: z.string(),
      completionPercentage: z.number().optional(),
      checklistItems: z.array(z.object({
        id: z.string(),
        label: z.string(),
        completed: z.boolean(),
      })).optional(),
      savedResources: z.array(z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
      })).optional(),
      personalNotes: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const { moduleName, ...data } = input;
      return await db.updateModuleProgress(ctx.user.id, moduleName, data);
    }),
  }),

  // ============ ANMELDUNG ============
  anmeldung: router({
    getOffices: publicProcedure.input(z.object({
      city: z.string().optional(),
    })).query(async ({ input }) => {
      return await db.getAnmeldungOffices(input.city);
    }),
    
    getCities: publicProcedure.query(async () => {
      return await db.getAllCities();
    }),
  }),

  // ============ BANKS ============
  banks: router({
    getRecommendations: publicProcedure.query(async () => {
      return await db.getBankRecommendations();
    }),
  }),

  // ============ HEALTH INSURANCE ============
  healthInsurance: router({
    getProviders: publicProcedure.input(z.object({
      type: z.enum(['gkv', 'pkv']).optional(),
    })).query(async ({ input }) => {
      return await db.getHealthInsuranceProviders(input.type);
    }),
  }),

  // ============ INTEGRATION COURSES ============
  integrationCourses: router({
    getCourses: publicProcedure.input(z.object({
      city: z.string().optional(),
      courseType: z.string().optional(),
    })).query(async ({ input }) => {
      return await db.getIntegrationCourses({
        city: input.city,
        courseType: input.courseType,
      });
    }),
    
    getCities: publicProcedure.query(async () => {
      return await db.getCourseCities();
    }),
  }),

  // ============ VISA & PERMITS ============
  visa: router({
    getPermitTypes: publicProcedure.query(async () => {
      return await db.getVisaPermitTypes();
    }),
    
    getPermitByCode: publicProcedure.input(z.object({
      code: z.string(),
    })).query(async ({ input }) => {
      return await db.getVisaPermitByCode(input.code);
    }),
  }),

  // ============ STRIPE CHECKOUT ============
  checkout: router({
    createSession: protectedProcedure.input(z.object({
      tier: z.enum(['premium']),
    })).mutation(async ({ ctx, input }) => {
      // This will be implemented with actual Stripe integration
      // For now, return a placeholder
      return {
        sessionId: 'cs_test_placeholder',
        url: 'https://checkout.stripe.com/pay/placeholder',
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
