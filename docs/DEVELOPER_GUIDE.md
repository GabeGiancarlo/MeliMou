# 🚀 MeliMou Developer Guide

Welcome to the MeliMou development team! This guide will help you get up and running quickly and understand our development workflows.

## 🎯 Quick Start

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm 10+** (comes with Node.js)
- **PostgreSQL 15+** (for database)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### One-Time Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/melimou.git
   cd melimou
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create environment file
   ./setup-env.sh
   
   # Edit .env.local with your specific values
   # At minimum, set DATABASE_URL and NEXTAUTH_SECRET
   ```

4. **Database Setup**
   ```bash
   # Install PostgreSQL (macOS)
   brew install postgresql@15
   brew services start postgresql@15
   
   # Create database
   createdb melimou_dev
   
   # Run migrations
   npm run db:migrate
   
   # Seed data (optional)
   npx tsx scripts/create-admin.ts
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application!

## 🛠️ Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Run database studio (visual database editor)
npm run db:studio

# Check code quality
npm run lint

# Run tests
npm test
```

### Code Quality Tools

```bash
# Lint and auto-fix code
npm run lint

# Format code with Prettier
npx prettier --write .

# Type checking
npx tsc --noEmit
```

## 🗄️ Database Development

### Schema Changes

1. **Update Schema**
   ```typescript
   // src/server/db/schema.ts
   export const newTable = createTable("new_table", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
     // ... other fields
   });
   ```

2. **Generate Migration**
   ```bash
   npm run db:generate
   ```

3. **Apply Migration**
   ```bash
   npm run db:migrate
   ```

4. **Verify Changes**
   ```bash
   npm run db:studio  # Visual database explorer
   ```

### Database Commands

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (development only)
npm run db:push

# Open database studio
npm run db:studio

# Reset database (careful!)
# Manual: Drop database and recreate
```

## 🔗 API Development

### Creating New API Endpoints

1. **Create Router**
   ```typescript
   // src/server/api/routers/example.ts
   import { z } from "zod";
   import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
   
   export const exampleRouter = createTRPCRouter({
     getAll: publicProcedure
       .query(async ({ ctx }) => {
         return ctx.db.query.examples.findMany();
       }),
   
     create: protectedProcedure
       .input(z.object({
         name: z.string().min(1),
         description: z.string().optional(),
       }))
       .mutation(async ({ ctx, input }) => {
         return ctx.db.insert(examples).values(input);
       }),
   });
   ```

2. **Add to Root Router**
   ```typescript
   // src/server/api/root.ts
   import { exampleRouter } from "./routers/example";
   
   export const appRouter = createTRPCRouter({
     // ... existing routers
     example: exampleRouter,
   });
   ```

3. **Use in Client**
   ```typescript
   // In React components
   import { api } from "~/trpc/react";
   
   function ExampleComponent() {
     const { data, isLoading } = api.example.getAll.useQuery();
     const createMutation = api.example.create.useMutation();
     
     // ... component logic
   }
   ```

### API Best Practices

- **Input Validation**: Always use Zod schemas for input validation
- **Error Handling**: Throw TRPCError for specific error cases
- **Authentication**: Use protectedProcedure for authenticated routes
- **Type Safety**: Leverage TypeScript inference throughout

## 🎨 Frontend Development

### Component Structure

```typescript
// src/components/feature/ExampleComponent.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface ExampleComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function ExampleComponent({ title, children }: ExampleComponentProps) {
  return (
    <Card className="honey-card">
      <CardHeader>
        <CardTitle className="honey-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
```

### Styling Guidelines

- **Use Tailwind CSS** for all styling
- **Honey Theme Classes**: Use custom honey-themed classes
  - `honey-bg`: Gradient background
  - `honey-text`: Golden text color
  - `honey-button`: Golden button styling
  - `honey-card`: Card with honey theme

### Page Structure

```typescript
// src/app/example/page.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export default function ExamplePage() {
  const { data: session } = useSession();
  const { data, isLoading } = api.example.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen honey-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </div>
  );
}
```

## 🔐 Authentication Development

### Protected Routes

```typescript
// src/middleware.ts - Route protection
export default withAuth(
  function middleware(req) {
    // Custom middleware logic
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Authorization logic
        return !!token;
      },
    },
  }
);
```

### Using Authentication in Components

```typescript
import { useSession } from "next-auth/react";

function ProtectedComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access Denied</p>;

  return <div>Protected content for {session?.user?.email}</div>;
}
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# E2E tests in development mode
npm run test:e2e:dev
```

### Writing Tests

```typescript
// src/__tests__/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Example functionality', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## 📦 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/melimou_dev"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional for development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Adding New Environment Variables

1. **Add to Schema**
   ```typescript
   // src/env.js
   export const env = createEnv({
     server: {
       // Add server-side variables
       NEW_API_KEY: z.string().optional(),
     },
     client: {
       // Add client-side variables (must start with NEXT_PUBLIC_)
       NEXT_PUBLIC_NEW_FEATURE: z.string().optional(),
     },
     runtimeEnv: {
       NEW_API_KEY: process.env.NEW_API_KEY,
       NEXT_PUBLIC_NEW_FEATURE: process.env.NEXT_PUBLIC_NEW_FEATURE,
     },
   });
   ```

2. **Use in Code**
   ```typescript
   import { env } from "~/env";
   
   const apiKey = env.NEW_API_KEY;
   ```

## 🚢 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard
3. **Deploy** - automatic on push to main branch

### Environment Setup for Production

```env
# Production environment variables
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="strong-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 📋 Git Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Message Format

```
feat: add new feature
fix: resolve bug in component
docs: update API documentation
style: improve button styling
refactor: optimize database queries
test: add unit tests for utils
```

## 🐛 Debugging

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   brew services list | grep postgresql
   
   # Restart PostgreSQL
   brew services restart postgresql@15
   ```

2. **Environment Variable Issues**
   ```bash
   # Check environment loading
   echo $DATABASE_URL
   
   # Recreate environment file
   ./setup-env.sh
   ```

3. **TypeScript Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Restart TypeScript server in VS Code
   # Cmd+Shift+P -> "TypeScript: Restart TS Server"
   ```

### Development Tools

- **Drizzle Studio**: Database visual editor (`npm run db:studio`)
- **tRPC Panel**: API explorer (if enabled in development)
- **React DevTools**: Browser extension for React debugging
- **Next.js DevTools**: Built-in performance and debugging tools

## 🎨 Design System

### Honey Theme Usage

```typescript
// Custom Tailwind classes available
className="honey-bg"           // Gradient background
className="honey-text"         // Golden text
className="honey-button"       // Golden button
className="honey-card"         // Themed card

// Color palette
bg-yellow-400                  // Primary honey gold
bg-amber-500                   // Deeper honey
from-purple-600 to-amber-400   // Gradient combinations
```

### Component Standards

- Use Shadcn/ui components as base
- Extend with honey theme classes
- Maintain consistent spacing (4, 6, 8, 12, 16px multiples)
- Mobile-first responsive design

## 📖 Learning Resources

### Project-Specific
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Database Schema](../src/server/db/schema.ts)

### Technology Stack
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🤝 Contributing

### Before You Start

1. Check existing issues and PRs
2. Follow the coding standards
3. Write tests for new features
4. Update documentation

### Code Standards

- Use TypeScript strictly
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Review Process

1. Self-review your code
2. Ensure all tests pass
3. Check for TypeScript errors
4. Verify accessibility compliance
5. Test on mobile devices

---

## 🆘 Getting Help

- **Bug Reports**: Create GitHub issue with reproduction steps
- **Feature Requests**: Discuss in GitHub Discussions
- **Questions**: Check existing documentation first
- **Emergency Issues**: Contact team leads directly

---

*Happy coding! 🍯✨* 