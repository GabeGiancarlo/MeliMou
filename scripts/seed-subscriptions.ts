import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { subscriptionPlans } from "../src/server/db/schema";

const conn = new Database("sqlite.db");
const db = drizzle(conn);

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started with Greek learning",
    price: 0, // Price in cents
    currency: "USD",
    intervalType: "month" as const,
    intervalCount: 1,
    features: [
      "3 AI tutor sessions per month",
      "Basic learning resources access",
      "Community forum access",
      "Progress tracking",
      "Basic Greek alphabet course"
    ],
    maxSessions: 3,
    maxResources: 10,
    isActive: true,
  },
  {
    name: "Pro",
    description: "For serious learners who want comprehensive Greek education",
    price: 1900, // $19.00 in cents
    currency: "USD",
    intervalType: "month" as const,
    intervalCount: 1,
    features: [
      "50 AI tutor sessions per month",
      "Premium learning resources",
      "Live cohort classes access",
      "Personalized study plans",
      "Email support",
      "Pronunciation practice tools",
      "Grammar exercises with feedback",
      "Cultural context lessons"
    ],
    maxSessions: 50,
    maxResources: 100,
    isActive: true,
  },
  {
    name: "Premium",
    description: "Complete Greek mastery with unlimited access and personal guidance",
    price: 3900, // $39.00 in cents
    currency: "USD",
    intervalType: "month" as const,
    intervalCount: 1,
    features: [
      "Unlimited AI tutor sessions",
      "All premium content access",
      "1-on-1 instructor sessions (2 per month)",
      "Priority customer support",
      "Certification path access",
      "Advanced conversation practice",
      "Business Greek modules",
      "Ancient Greek introduction",
      "Custom learning paths",
      "Progress analytics dashboard"
    ],
    maxSessions: -1, // Unlimited
    maxResources: -1, // Unlimited
    isActive: true,
  },
  {
    name: "Pro Annual",
    description: "Save 20% with annual Pro subscription",
    price: 18240, // $182.40 in cents (20% off $228)
    currency: "USD",
    intervalType: "year" as const,
    intervalCount: 1,
    features: [
      "50 AI tutor sessions per month",
      "Premium learning resources",
      "Live cohort classes access",
      "Personalized study plans",
      "Email support",
      "Pronunciation practice tools",
      "Grammar exercises with feedback",
      "Cultural context lessons",
      "2 months free compared to monthly"
    ],
    maxSessions: 50,
    maxResources: 100,
    isActive: true,
  },
  {
    name: "Premium Annual",
    description: "Save 25% with annual Premium subscription",
    price: 35100, // $351.00 in cents (25% off $468)
    currency: "USD",
    intervalType: "year" as const,
    intervalCount: 1,
    features: [
      "Unlimited AI tutor sessions",
      "All premium content access",
      "1-on-1 instructor sessions (2 per month)",
      "Priority customer support",
      "Certification path access",
      "Advanced conversation practice",
      "Business Greek modules",
      "Ancient Greek introduction",
      "Custom learning paths",
      "Progress analytics dashboard",
      "3 months free compared to monthly"
    ],
    maxSessions: -1, // Unlimited
    maxResources: -1, // Unlimited
    isActive: true,
  }
];

async function seedSubscriptionPlans() {
  try {
    console.log("🌱 Seeding subscription plans...");

    // Clear existing plans
    await db.delete(subscriptionPlans);

    // Insert new plans
    const insertedPlans = await db.insert(subscriptionPlans).values(plans).returning();

    console.log(`✅ Successfully seeded ${insertedPlans.length} subscription plans:`);
    insertedPlans.forEach(plan => {
      console.log(`   - ${plan.name}: $${plan.price / 100}/${plan.intervalType}`);
    });

  } catch (error) {
    console.error("❌ Error seeding subscription plans:", error);
    process.exit(1);
  } finally {
    conn.close();
  }
}

// Run the seed function
seedSubscriptionPlans().then(() => {
  console.log("🎉 Subscription plans seeding completed!");
  process.exit(0);
}); 