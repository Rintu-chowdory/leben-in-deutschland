import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // AUTH BYPASSED FOR LOCAL DEV
  const devUser: User = {
    id: 1,
    openId: "local-dev",
    name: "Dev User",
    email: "dev@local.dev",
    loginMethod: "local",
    lastSignedIn: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  return {
    req: opts.req,
    res: opts.res,
    user: devUser,
  };
}
