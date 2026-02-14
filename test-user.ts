import { connectToDatabase } from "./lib/database/mongoose";
import User from "./lib/database/models/user.model";

async function createTestUser() {
  try {
    await connectToDatabase();

    const user = await User.create({
      clerkId: "test_clerk_123",
      email: "leoluna2022@outlook.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      photo: "https://placehold.co/200",
    });

    console.log("✅ Test user created:");
    console.log(user);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
}

createTestUser();
