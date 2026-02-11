import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import type { WebhookEvent, UserJSON } from "@clerk/nextjs/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  // ✅ Next 15 -> headers async
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = event.type;

  // ===== USER CREATED =====
  if (eventType === "user.created") {
    const user = event.data as UserJSON;

    await createUser({
      clerkId: user.id,
      email: user.email_addresses?.[0]?.email_address ?? "",
      username: user.username ?? user.id,
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      photo: user.image_url,
    });
  }

  // ===== USER UPDATED =====
  if (eventType === "user.updated") {
    const user = event.data as UserJSON;

    await updateUser(user.id, {
      username: user.username ?? user.id,
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      photo: user.image_url,
    });
  }

  // ===== USER DELETED =====
  if (eventType === "user.deleted") {
    const user = event.data as { id: string };

    await deleteUser(user.id);
  }

  return NextResponse.json({ success: true });
}
