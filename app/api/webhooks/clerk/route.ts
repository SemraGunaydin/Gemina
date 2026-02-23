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

  try {
    // ✅ Headers
    const headerPayload = await headers();

    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    // ✅ Verify payload
    const payload = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET);

    const event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("🔥 WEBHOOK RECEIVED:", event.type);

    // ================= USER CREATED =================
    if (event.type === "user.created") {
      const user = event.data as UserJSON;

      if (!user.email_addresses?.length) {
        console.log("⚠️ User has no email");
        return NextResponse.json({ skipped: true });
      }

      const newUser = await createUser({
        clerkId: user.id,
        email: user.email_addresses[0].email_address,
        username: user.username ?? user.id,
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        photo: user.image_url,
      });

      console.log("✅ USER CREATED:", newUser);
    }

    // ================= USER UPDATED =================
    if (event.type === "user.updated") {
      const user = event.data as UserJSON;

      const updatedUser = await updateUser(user.id, {
        username: user.username ?? user.id,
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        photo: user.image_url,
      });

      console.log("✅ USER UPDATED:", updatedUser);
    }

    // ================= USER DELETED =================
    if (event.type === "user.deleted") {
      const user = event.data as { id: string };

      const deletedUser = await deleteUser(user.id);

      console.log("🗑 USER DELETED:", deletedUser);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return new Response("Webhook error", { status: 500 });
  }
}
