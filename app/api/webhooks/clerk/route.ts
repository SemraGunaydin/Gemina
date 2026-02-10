import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing WEBHOOK_SECRET");
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  // ⭐ CREATE USER
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
    } = evt.data;

 const email = email_addresses[0].email_address;

 const user = {
  clerkId: id,
  email: email_addresses[0].email_address,
  username: username ?? "",  // string zorunlu
  firstName: first_name ?? undefined,
  lastName: last_name ?? undefined,
  photo: image_url ?? "",
};

    const newUser = await createUser(user);

    if (newUser) {
      const client = await clerkClient();

      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id.toString(),
        },
      });
    }

    return NextResponse.json({ success: true });
  }

  // ⭐ UPDATE USER
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    await updateUser(id, {
  firstName: first_name ?? "",
  lastName: last_name ?? "",
  username: username ?? "",
  photo: image_url,
});

    return NextResponse.json({ success: true });
  }

  // ⭐ DELETE USER
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await deleteUser(id!);

    return NextResponse.json({ success: true });
  }

  return new Response("", { status: 200 });
}
