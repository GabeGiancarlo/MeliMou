# 🔗 MeliMou API Documentation

## 📋 Overview

MeliMou uses **tRPC** for type-safe client-server communication. All APIs are automatically typed and validated using Zod schemas. The API is organized into logical routers based on feature domains.

### API Architecture
- **Type Safety**: End-to-end TypeScript with automatic inference
- **Validation**: Zod schemas for input/output validation
- **Authentication**: Protected procedures require valid session
- **Error Handling**: Structured error responses with proper HTTP codes

### Base URL
- **Development**: `http://localhost:3000/api/trpc`
- **Production**: `https://your-domain.com/api/trpc`

## 🛡️ Authentication

### Procedure Types
- **publicProcedure**: No authentication required
- **protectedProcedure**: Requires valid user session

### Authentication Flow
1. User signs in via NextAuth.js OAuth providers
2. Session token stored in HTTP-only cookie
3. tRPC context validates session on protected routes
4. User ID available in `ctx.session.user.id`

## 📚 API Routers

### 👤 User Router (`api.user`)

User profile management, onboarding, and analytics.

#### `getProfile`
**Type**: Query (Protected)  
**Description**: Get current user's complete profile with subscription info

```typescript
// Usage
const profile = api.user.getProfile.useQuery();

// Response
{
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  greekLevel: "absolute_beginner" | "beginner" | "elementary" | "intermediate" | "advanced" | "native";
  subscriptionTier: "free" | "pro" | "premium";
  hasCompletedOnboarding: boolean;
  // ... additional profile fields
  subscriptions: UserSubscription[];
}
```

#### `completeOnboarding`
**Type**: Mutation (Protected)  
**Description**: Complete user onboarding process

```typescript
// Input Schema
{
  role: "student" | "instructor";
  greekLevel: "absolute_beginner" | "beginner" | "elementary" | "intermediate" | "advanced" | "native";
  learningGoals: string[]; // min 1 item
  studyTimePerWeek: number; // 1-50 hours
  previousExperience?: string;
  interests?: string[];
  howHeardAboutUs?: string;
  wantsPracticeTest?: boolean;
  formalityPreference?: "informal" | "formal" | "mixed";
}

// Usage
const completeOnboarding = api.user.completeOnboarding.useMutation();
await completeOnboarding.mutateAsync(onboardingData);
```

#### `updateProfile`
**Type**: Mutation (Protected)  
**Description**: Update user profile information

#### `getOnboardingStatus`
**Type**: Query (Protected)  
**Description**: Check if user has completed onboarding

#### `getUserAnalytics`
**Type**: Query (Protected)  
**Description**: Get user analytics (admin only or own data)

---

### 💳 Subscription Router (`api.subscription`)

Subscription plan management and billing.

#### `getPlans`
**Type**: Query (Public)  
**Description**: Get all available subscription plans

```typescript
// Response
SubscriptionPlan[] = {
  id: number;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  intervalType: "month" | "year";
  features: string[];
  maxSessions: number; // -1 = unlimited
  isActive: boolean;
}
```

#### `getUserSubscription`
**Type**: Query (Protected)  
**Description**: Get current user's active subscription

#### `createSubscription`
**Type**: Mutation (Protected)  
**Description**: Create new subscription via Stripe

#### `cancelSubscription`
**Type**: Mutation (Protected)  
**Description**: Cancel active subscription

---

### 🤖 Tutor Router (`api.tutor`)

AI-powered tutoring sessions and conversation management.

#### `startSession`
**Type**: Mutation (Protected)  
**Description**: Start new AI tutoring session

```typescript
// Input
{
  topic?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  sessionType?: "conversation" | "grammar" | "vocabulary";
}

// Response
{
  sessionId: string;
  topic: string;
  difficulty: string;
  createdAt: Date;
}
```

#### `sendMessage`
**Type**: Mutation (Protected)  
**Description**: Send message in tutoring session

```typescript
// Input
{
  sessionId: string;
  content: string;
  messageType: "text" | "audio";
}

// Response
{
  userMessage: TutorMessage;
  aiResponse: TutorMessage;
}
```

#### `getSessions`
**Type**: Query (Protected)  
**Description**: Get user's tutoring session history

#### `getSessionMessages`
**Type**: Query (Protected)  
**Description**: Get messages for specific session

---

### 📚 Learning Path Router (`api.learningPath`)

Structured learning curriculum management.

#### `getAll`
**Type**: Query (Public)  
**Description**: Get all public learning paths

```typescript
// Response
LearningPath[] = {
  id: number;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  requiredSubscriptionTier: "free" | "pro" | "premium";
  modules: Module[];
}
```

#### `getById`
**Type**: Query (Public)  
**Description**: Get specific learning path with modules

#### `getUserProgress`
**Type**: Query (Protected)  
**Description**: Get user's progress in learning paths

---

### 📖 Lesson Router (`api.lesson`)

Individual lesson content and progress tracking.

#### `getByModule`
**Type**: Query (Public)  
**Description**: Get lessons for specific module

#### `getById`
**Type**: Query (Public)  
**Description**: Get specific lesson content

#### `markComplete`
**Type**: Mutation (Protected)  
**Description**: Mark lesson as completed

#### `updateProgress`
**Type**: Mutation (Protected)  
**Description**: Update lesson progress percentage

---

### 📖 Resource Router (`api.resource`)

Learning materials and resource library.

#### `getAll`
**Type**: Query (Public)  
**Description**: Get all available resources

```typescript
// Response
Resource[] = {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "video" | "audio" | "link" | "quiz";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  url: string;
  requiredSubscriptionTier: "free" | "pro" | "premium";
}
```

#### `getByCategory`
**Type**: Query (Public)  
**Description**: Get resources filtered by category

#### `getById`
**Type**: Query (Public)  
**Description**: Get specific resource details

---

### 💬 Chat Router (`api.chat`)

Community chat and messaging system.

#### `getMessages`
**Type**: Query (Protected)  
**Description**: Get chat messages for room

#### `sendMessage`
**Type**: Mutation (Protected)  
**Description**: Send message to chat room

```typescript
// Input
{
  content: string;
  roomId?: string; // default: "general"
}

// Response
{
  id: number;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
}
```

---

### 🔔 Alert Router (`api.alert`)

System notifications and user alerts.

#### `getAll`
**Type**: Query (Protected)  
**Description**: Get all alerts for current user

```typescript
// Response
Alert[] = {
  id: number;
  title: string;
  content: string;
  type: "system" | "instructor" | "achievement" | "reminder";
  isRead: boolean;
  createdAt: Date;
}
```

#### `markAsRead`
**Type**: Mutation (Protected)  
**Description**: Mark alert as read

#### `markAllAsRead`
**Type**: Mutation (Protected)  
**Description**: Mark all alerts as read

---

### 📝 Post Router (`api.post`)

Community forum posts and discussions.

#### `getAll`
**Type**: Query (Public)  
**Description**: Get all forum posts

#### `create`
**Type**: Mutation (Protected)  
**Description**: Create new forum post

```typescript
// Input
{
  title: string;
  content: string;
  category?: string;
}
```

## 🚀 Client Usage

### React Query Hooks

```typescript
import { api } from "~/trpc/react";

// Queries (GET operations)
const { data, isLoading, error } = api.user.getProfile.useQuery();

// Mutations (POST/PUT/DELETE operations)
const mutation = api.user.updateProfile.useMutation({
  onSuccess: (data) => {
    console.log("Profile updated:", data);
  },
  onError: (error) => {
    console.error("Update failed:", error.message);
  },
});

// Execute mutation
await mutation.mutateAsync({
  name: "New Name",
  greekLevel: "intermediate"
});
```

### Server-Side Usage

```typescript
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Create server caller
const ctx = await createTRPCContext({ headers: new Headers() });
const caller = createCaller(ctx);

// Call procedures directly
const plans = await caller.subscription.getPlans();
```

## 🛠️ Development Guidelines

### Adding New Procedures

1. **Create/Update Router**
   ```typescript
   // src/server/api/routers/example.ts
   export const exampleRouter = createTRPCRouter({
     getProcedure: publicProcedure
       .input(z.object({ id: z.string() }))
       .query(async ({ ctx, input }) => {
         // Implementation
       }),
   });
   ```

2. **Add to Root Router**
   ```typescript
   // src/server/api/root.ts
   export const appRouter = createTRPCRouter({
     // ... existing routers
     example: exampleRouter,
   });
   ```

3. **Use in Client**
   ```typescript
   const data = api.example.getProcedure.useQuery({ id: "123" });
   ```

### Input Validation

```typescript
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(["student", "instructor"]),
  preferences: z.array(z.string()).optional(),
});

const procedure = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    // input is fully typed and validated
  });
```

### Error Handling

```typescript
import { TRPCError } from "@trpc/server";

const procedure = protectedProcedure
  .mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    
    // Business logic
  });
```

## 🔒 Security Considerations

### Authentication
- All protected procedures validate session
- User ID extracted from session token
- No direct user ID acceptance in inputs

### Authorization
- Role-based access control in procedures
- Subscription tier validation for premium features
- User can only access own data (except admins)

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention via Drizzle ORM
- XSS protection through proper sanitization

## 📊 Response Formats

### Success Response
```typescript
{
  result: {
    data: T // Actual response data
  }
}
```

### Error Response
```typescript
{
  error: {
    message: string;
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";
    data?: {
      code: string;
      httpStatus: number;
    }
  }
}
```

---

*This API documentation is auto-generated from tRPC schema. Keep in sync with code changes.* 