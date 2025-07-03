# 🍯 MeliMou - Greek Language Learning Platform

> Where language learning meets the sweetness of honey

**MeliMou** (Μέλι + Mouse = Honey Mouse) is a comprehensive Greek language learning platform featuring AI-powered conversations, expert-led cohorts, and personalized learning paths. Built with modern web technologies and a sweet honey-themed design.

## ✨ Recent Updates (Latest Release)

### 🍯 **Honey Branding & UI Overhaul**
- **New honey emoji favicon** (🍯) replacing the old generic icon
- **Gold/amber color scheme** with beautiful gradients throughout the UI
- **"Sweet learning" messaging** emphasizing the honey theme
- **Enhanced visual identity** with purple + gold color combination
- **Honey emojis** integrated throughout the interface for cohesive branding

### 🔐 **Enhanced Authentication System**
- **Removed GitHub OAuth** (replaced with more popular providers)
- **Added 5 new social login providers:**
  - 🔴 **Google** - with red hover effects
  - 🔵 **Facebook** - with blue hover effects  
  - 🟣 **Instagram** - with purple gradient hover
  - 🔷 **Twitter/X** - with blue hover effects
  - 🔵 **LinkedIn** - with professional blue hover
- **Provider-specific styling** with unique colors and hover animations
- **Comprehensive OAuth setup** ready for production credentials

### 🎨 **UI/UX Improvements**
- **Beautiful sign-in page** with provider-specific colors and icons
- **Enhanced homepage** with honey-themed CTAs and messaging
- **Improved feature cards** with emojis and gold accent colors
- **Better color contrast** and accessibility improvements
- **Responsive design** optimized for all devices

## 🚀 Features

### 🤖 **AI-Powered Learning**
- 24/7 AI tutor for conversation practice
- Instant pronunciation feedback
- Personalized difficulty adjustment
- Natural language processing for Greek

### 👥 **Live Cohort Classes**
- Expert Greek instructors
- Small group sizes (max 8 students)
- Flexible scheduling
- Interactive group learning

### 📚 **Rich Learning Content**
- Progressive lessons from alphabet to advanced literature
- Cultural context videos
- Interactive exercises and assessments
- Greek mythology and history integration

### 🏆 **Certification & Progress**
- Official completion certificates
- Detailed progress tracking and analytics
- Skill-based assessments
- Achievement system

### 🏛️ **Cultural Immersion**
- Greek mythology and ancient history
- Traditional music and arts
- Regional dialects and customs
- Cultural context in every lesson

### 💬 **Community Features**
- Active discussion forums
- Language exchange partner matching
- 24/7 community support
- Native speaker connections

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Database:** SQLite (development) / PostgreSQL (production ready)
- **ORM:** Drizzle ORM with type-safe queries
- **Authentication:** NextAuth.js with 5 OAuth providers
- **Styling:** Tailwind CSS with custom honey/gold theme
- **UI Components:** Shadcn/ui with custom styling
- **API:** tRPC for end-to-end type safety
- **Payments:** Stripe integration (ready for activation)

## 🏗️ Database Schema

Comprehensive 19-table database schema including:

### **Core Tables**
- `users` - User profiles with onboarding data
- `accounts` - OAuth account connections
- `sessions` - User authentication sessions
- `verificationTokens` - Email verification

### **Learning System**
- `learningPaths` - Structured learning courses
- `modules` - Course modules and chapters
- `lessons` - Individual lesson content
- `userProgress` - Progress tracking
- `tutorSessions` - AI tutor interaction logs

### **Subscription System**
- `subscriptionPlans` - Tiered pricing plans
- `userSubscriptions` - Active subscriptions
- `onboardingResponses` - User onboarding data

### **Community Features**
- `cohorts` - Live learning groups
- `cohortMembers` - Group membership
- `messages` - Community messaging
- `resources` - Learning materials
- `alerts` - System notifications

## 🎯 Subscription Plans

### 🆓 **Free Plan** - $0/month
- 3 AI tutor sessions per month
- Basic alphabet course access
- Community forum access
- Progress tracking
- Basic pronunciation tools

### 💎 **Pro Plan** - $19/month
- 50 AI tutor sessions per month
- Premium learning content
- Live cohort classes
- Email support
- Advanced pronunciation tools
- Grammar exercises
- Cultural immersion lessons

### 👑 **Premium Plan** - $39/month
- Unlimited AI tutor sessions
- 1-on-1 instruction sessions
- Certification courses
- Priority support
- Business Greek content
- Ancient Greek introduction
- Custom learning paths

### 💰 **Annual Plans**
- **Pro Annual:** $182.40/year (20% savings)
- **Premium Annual:** $351/year (25% savings)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/melimou.git
   cd melimou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your OAuth credentials:
   ```env
   # Database
   DATABASE_URL="file:./sqlite.db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   # ... (add other providers)
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` and enjoy the honey-sweet Greek learning experience! 🍯

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🔐 OAuth Setup Guide

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Facebook/Instagram OAuth
1. Visit [Meta for Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Configure Valid OAuth Redirect URIs
5. Get App ID and App Secret

### Twitter/X OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Enable OAuth 2.0
4. Set callback URL: `http://localhost:3000/api/auth/callback/twitter`

### LinkedIn OAuth
1. Visit [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Create a new app
3. Add Sign In with LinkedIn product
4. Configure authorized redirect URLs

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication pages
│   ├── onboarding/     # User onboarding flow
│   ├── subscription/   # Subscription management
│   └── components/     # Page-specific components
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn/ui components
│   ├── auth/          # Authentication components
│   └── subscription/  # Subscription components
├── server/            # Backend logic
│   ├── api/           # tRPC API routes
│   ├── auth.ts        # NextAuth configuration
│   └── db/           # Database configuration
├── lib/              # Utility functions
├── hooks/            # React hooks
└── styles/           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary:** Gold/Amber gradients (`from-amber-500 to-yellow-600`)
- **Secondary:** Purple (`purple-500`, `purple-600`)
- **Accent:** Various provider-specific colors
- **Background:** Dark theme with `gray-800/900`
- **Text:** White and amber for highlights

### Typography
- **Font:** Geist Sans for modern, clean readability
- **Headings:** Bold weights with gradient text effects
- **Body:** Balanced contrast for accessibility

### Icons & Emojis
- **Honey emoji** (🍯) as primary brand icon
- **Cultural emojis** throughout (🏛️, 🇬🇷, ✨)
- **Provider icons** for OAuth buttons
- **Feature icons** using Lucide React

## 🚀 Deployment

### Prerequisites for Production
- Real OAuth credentials from all providers
- Production database (PostgreSQL recommended)
- Stripe account for payments
- Domain name and SSL certificate

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="complex-random-string"
NEXTAUTH_URL="https://yourdomain.com"
# ... real OAuth credentials
```

### Recommended Hosting
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/honey-enhancement`
3. Make your changes with honey-sweet code 🍯
4. Commit with descriptive messages
5. Push and create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Greek Language Community** for inspiration and feedback
- **NextAuth.js** for robust authentication
- **Drizzle ORM** for type-safe database operations
- **Shadcn/ui** for beautiful UI components
- **Vercel** for amazing deployment platform

## 📞 Support

- 📧 **Email:** support@melimou.com
- 💬 **Discord:** [Join our community](https://discord.gg/melimou)
- 🐦 **Twitter:** [@MeliMouGreek](https://twitter.com/MeliMouGreek)
- 📖 **Documentation:** [docs.melimou.com](https://docs.melimou.com)

---

<div align="center">
  <h3>🍯 Built with love and honey for the Greek language community 🏛️</h3>
  <p>
    <strong>Καλή τύχη με τα ελληνικά! (Good luck with Greek!)</strong>
  </p>
</div>
