import { VercelRequest, VercelResponse } from "@vercel/node";
import { handleOAuthCallback } from "../../server/_core/oauth";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await handleOAuthCallback(req as any, res as any);
  } catch (error) {
    console.error("[OAuth Callback Error]", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
};
