import { createNodeHTTPHandler } from "@trpc/server/adapters/node-http";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const handler = createNodeHTTPHandler({
  router: appRouter,
  createContext,
});

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return handler(req, res);
};
