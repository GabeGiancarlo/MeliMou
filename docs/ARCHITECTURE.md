# 🏗️ MeliMou Architecture Documentation

## 🍯 System Overview

MeliMou is a modern Greek language learning platform built with Next.js 14, featuring AI-powered tutoring, live cohort classes, and cultural immersion. The application uses a honey-themed design system throughout.

### Core Philosophy
- **🎯 User-Centric Design**: Prioritize user experience with intuitive navigation and beautiful UI
- **🚀 Performance First**: Optimized for speed with modern web technologies
- **🔒 Security by Design**: Comprehensive authentication and data protection
- **📱 Mobile-First**: Responsive design for all device types
- **🍯 Consistent Branding**: Honey-themed design system throughout

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom honey/gold theme
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: React Query (TanStack Query) via tRPC
- **Authentication**: NextAuth.js v4

### Backend
- **API Layer**: tRPC for type-safe client-server communication
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with multiple OAuth providers
- **File Storage**: Local filesystem (expandable to cloud)
- **Email**: Ready for integration (SMTP/SendGrid)

### DevOps & Tools
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind plugin
- **Testing**: Vitest (unit) + Cypress (e2e)
- **Database Management**: Drizzle Kit + Postico (GUI)
- **Deployment**: Vercel (configured)

## 📁 Project Structure

```
MeliMou/
├── docs/                       # Documentation files
├── drizzle/                    # Database migrations and metadata
├── public/                     # Static assets (favicon, SW, etc.)
├── scripts/                    # Database seeding and admin scripts
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (features)/        # Feature pages (tutor, learning, etc.)
│   │   ├── api/               # API routes (tRPC, NextAuth)
│   │   ├── components/        # Page-specific components
│   │   └── dashboard/         # Protected dashboard area
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/ui base components
│   │   └── feature-modules/   # Feature-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and configurations
│   ├── server/                # Backend logic
│   │   ├── api/              # tRPC routers and procedures
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── db/               # Database schema and connection
│   ├── styles/               # Global CSS and Tailwind config
│   ├── trpc/                 # tRPC client configuration
│   ├── env.js                # Environment variable validation
│   └── middleware.ts         # Next.js middleware for auth/routing
├── tailwind.config.ts         # Tailwind CSS configuration
├── drizzle.config.ts         # Database configuration
└── package.json              # Dependencies and scripts
```

## 🔄 Data Flow Architecture

### 1. Client-Server Communication
```
React Components → tRPC Client → tRPC Server → Drizzle ORM → PostgreSQL
                                    ↓
                              NextAuth.js ← OAuth Providers
```

### 2. Authentication Flow
```
User Action → NextAuth.js → OAuth Provider → Callback → Session Creation → Database
```

### 3. Feature Access Control
```
Request → Middleware → Session Check → Permission Validation → Route Access
```

## 🗄️ Database Architecture

### Core Tables
- **users**: User profiles, preferences, and subscription data
- **accounts**: OAuth provider account linking
- **sessions**: Active user sessions
- **verificationTokens**: Email verification tokens

### Learning System
- **learningPaths**: Structured course curricula
- **modules**: Course sections within learning paths
- **lessons**: Individual lesson content and exercises
- **userProgress**: Student progress tracking

### Community Features
- **cohorts**: Live learning groups
- **cohortMembers**: Group membership and roles
- **messages**: Community chat system
- **resources**: Curated learning materials

### AI & Business
- **tutorSessions**: AI conversation history
- **tutorMessages**: Individual AI chat messages
- **subscriptionPlans**: Available pricing tiers
- **userSubscriptions**: Active subscription management
- **alerts**: System notifications

### Content Management
- **posts**: Forum posts and discussions
- **onboardingResponses**: User preference data

## 🔐 Security Architecture

### Authentication Layers
1. **NextAuth.js**: Handles OAuth flow and session management
2. **Middleware**: Route protection and redirection
3. **tRPC Context**: Request-level authentication
4. **Database**: Secure user data storage

### Authorization Levels
- **Public**: Homepage, feature previews, auth pages
- **Authenticated**: Dashboard, basic features
- **Subscription-Gated**: Premium features based on plan
- **Admin**: Administrative functions and user management

## 🎨 Design System

### Honey Theme Colors
- **Primary**: Purple to amber gradients (`from-[#974cd9] to-[#2e026d]`)
- **Accent**: Golden honey tones (`#F59E0B`, `#D97706`)
- **Background**: Dark theme with warm undertones
- **Text**: High contrast white/gray on dark backgrounds

### Component Architecture
- **Base UI**: Shadcn/ui components with Radix primitives
- **Custom Components**: Honey-themed extensions and variants
- **Layout Components**: Navigation, headers, and page structures
- **Feature Components**: Specialized UI for learning features

## 🚀 Feature Modules

### 🤖 AI Tutor System
- **Location**: `src/app/tutor/`, `src/server/api/routers/tutor.ts`
- **Purpose**: Interactive Greek language practice with AI
- **Components**: Chat interface, session management, progress tracking

### 📚 Learning Paths
- **Location**: `src/app/learning-paths/`, `src/server/api/routers/learning-path.ts`
- **Purpose**: Structured course progression system
- **Components**: Path browser, module viewer, progress tracking

### 🏛️ Cultural Immersion
- **Location**: `src/app/culture/`, `src/server/api/routers/culture.ts`
- **Purpose**: Greek culture and history exploration
- **Components**: Cultural modules, multimedia content, events

### 💬 Community Chat
- **Location**: `src/app/chat/`, `src/server/api/routers/chat.ts`
- **Purpose**: Student community and discussion forums
- **Components**: Chat rooms, message threads, user interactions

### 🏆 Certification System
- **Location**: `src/app/certification/`, `src/server/api/routers/certification.ts`
- **Purpose**: Professional Greek language certificates
- **Components**: Assessment tools, certificate generation, progress tracking

### 📖 Resource Library
- **Location**: `src/app/resources/`, `src/server/api/routers/resource.ts`
- **Purpose**: Curated learning materials and references
- **Components**: Resource browser, categorization, user bookmarks

## 🔧 Development Workflow

### Local Development
1. **Setup**: Environment configuration and database setup
2. **Development**: Hot-reload development server
3. **Testing**: Unit tests with Vitest, E2E with Cypress
4. **Linting**: ESLint and Prettier for code quality

### Database Management
1. **Schema Changes**: Update `src/server/db/schema.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Apply Migration**: `npm run db:migrate`
4. **Database GUI**: `npm run db:studio` for Drizzle Studio

### API Development
1. **Create Router**: Add new router in `src/server/api/routers/`
2. **Add Procedures**: Define queries and mutations
3. **Export Router**: Include in `src/server/api/root.ts`
4. **Client Usage**: Import and use via `api` from `~/trpc/react`

## 🌐 Environment Configuration

### Required Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/melimou"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
# ... additional providers

# Stripe (optional)
STRIPE_SECRET_KEY="your-stripe-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-public"
```

## 📈 Performance Considerations

### Optimization Strategies
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Image Optimization**: Next.js Image component with optimization
- **Database Queries**: Efficient Drizzle ORM queries with proper indexing
- **Caching**: React Query for client-side caching
- **Static Generation**: Static pages where appropriate

### Monitoring Points
- **Database Performance**: Query execution times
- **API Response Times**: tRPC procedure performance
- **Client Bundle Size**: JavaScript payload optimization
- **Core Web Vitals**: User experience metrics

## 🔮 Future Architecture Considerations

### Scalability Preparations
- **Microservices**: tRPC routers can be split into separate services
- **Cloud Database**: Easy migration from local PostgreSQL
- **CDN Integration**: Static asset optimization
- **Caching Layer**: Redis for session and query caching

### Feature Expansions
- **Real-time Features**: WebSocket integration for live features
- **AI Enhancement**: OpenAI/Anthropic API integration
- **Mobile App**: React Native with shared tRPC API
- **Video Content**: Video streaming and live classes

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **tRPC Documentation**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **NextAuth.js**: https://next-auth.js.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

*This architecture documentation is maintained by the development team. Please update as the system evolves.* 