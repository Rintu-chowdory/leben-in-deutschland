import { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as string,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("[Stripe Webhook Error]", err);
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      console.log("[Webhook] Checkout session completed", event.data.object);
      break;
    case "payment_intent.succeeded":
      console.log("[Webhook] Payment intent succeeded", event.data.object);
      break;
    case "customer.subscription.updated":
      console.log("[Webhook] Subscription updated", event.data.object);
      break;
    default:
      console.log("[Webhook] Unhandled event type", event.type);
  }

  res.json({ received: true });
};
