#!/usr/bin/env node
import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdminAccount() {
  console.log("🍯 Creating MeliMou Admin Account...\n");

  const adminEmail = "gabe@melimou.com";
  const adminPassword = "admin123"; // Change this after first login!
  const adminName = "Gabe Giancarlo";

  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    });

    if (existingAdmin) {
      console.log("❌ Admin account already exists with email:", adminEmail);
      console.log("🔑 Use existing credentials to sign in");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await db.insert(users).values({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      hasCompletedOnboarding: true,
      subscriptionTier: "premium",
      subscriptionStatus: "active",
      greekLevel: "advanced",
      age: 25,
      gender: "male",
      learningGoals: JSON.stringify([
        "platform_development", 
        "user_experience", 
        "greek_culture"
      ]),
      interests: JSON.stringify([
        "technology", 
        "education", 
        "greek_history"
      ]),
      emailVerified: new Date(),
      createdAt: new Date(),
    }).returning();

    console.log("✅ Admin account created successfully!");
    console.log("\n🔐 Admin Login Credentials:");
    console.log("   Email:", adminEmail);
    console.log("   Password:", adminPassword);
    console.log("   Role: Administrator");
    console.log("\n🚨 IMPORTANT: Change your password after first login!");
    console.log("\n🍯 You can now sign in at: http://localhost:3000/auth/signin");
    console.log("\n👑 Admin Features Available:");
    console.log("   • Full platform access");
    console.log("   • User management");
    console.log("   • Content management");
    console.log("   • Analytics and reports");
    console.log("   • System configuration");

  } catch (error) {
    console.error("❌ Error creating admin account:", error);
    process.exit(1);
  }
}

createAdminAccount()
  .then(() => {
    console.log("\n🎉 Admin account setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }); 