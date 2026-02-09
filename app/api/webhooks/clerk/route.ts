/* eslint-disable camelcase */
// app/api/webhooks/clerk/route.ts
import { Webhook, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Clerk Webhook Secret (env variable)
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Clerk-Signature")!;

  let event: WebhookEvent;

  try {
    // v3’te verifyWebhookEvent kullanılır
    event = Webhook.verifyWebhookEvent({
      payload: body,
      secret: webhookSecret,
      signature,
    });

    console.log("Received Clerk Webhook:", event.type);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed", err);
    return new NextResponse("Invalid request", { status: 400 });
  }
}
