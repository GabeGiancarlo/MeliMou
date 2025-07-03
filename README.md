# 🍯 MeliMou - Greek Language Learning Platform

> Where language learning meets the sweetness of honey

**MeliMou** (Μέλι + Mouse = Honey Mouse) is a comprehensive Greek language learning platform featuring AI-powered conversations, expert-led cohorts, and personalized learning paths. Built with modern web technologies and a sweet honey-themed design.

## ✨ Latest Updates (v2.0 - Sweet Preview Release)

### 🍯 **Complete Public Access & Preview System**
- **🚀 No paywall exploration** - All feature pages now accessible without sign-up
- **✨ Beautiful preview banners** encouraging users to join after exploring
- **🎨 Consistent honey branding** across every page with 🍯 emojis and gold gradients
- **🔗 Fully functional feature cards** with working navigation and hover animations
- **💫 Sweet user journey** from discovery to sign-up to full access

### 🌟 **Enhanced Feature Pages**
- **🤖 AI Tutor Preview** - Experience demo conversations with intelligent feedback
- **📚 Learning Paths Explorer** - Browse solo and cohort options before committing
- **🏆 Certification Showcase** - See the complete certificate tracking system
- **🏛️ Cultural Immersion** - Explore Greek heritage modules and virtual events
- **📖 Resource Library** - Preview comprehensive learning materials
- **💬 Community Chat** - Experience the vibrant learning community

### 🔐 **Smart Authentication Flow**
- **Public exploration** of all features without barriers
- **Contextual sign-up prompts** when users are ready to commit
- **5 social login providers** (Google, Facebook, Instagram, Twitter, LinkedIn)
- **Seamless onboarding** once users decide to join

### 🎨 **Honey-Themed Design System**
- **🍯 Golden honey favicon** replacing generic icons
- **🌈 Purple-to-amber gradients** creating visual consistency
- **✨ Sparkle animations** and hover effects throughout
- **🎯 Sweet messaging** emphasizing the honey learning experience
- **📱 Responsive design** optimized for all devices

## 🚀 Core Features

### 🤖 **AI-Powered Greek Tutor**
- **24/7 conversation practice** with intelligent AI responses
- **Instant pronunciation feedback** and correction
- **Adaptive difficulty** based on your skill level
- **Topic-based sessions** (food, travel, business, culture)
- **Formality level adjustment** (informal, formal, mixed)

### 👥 **Live Cohort Classes**
- **Expert native instructors** with teaching credentials
- **Small intimate groups** (maximum 8 students)
- **Flexible scheduling** across multiple time zones
- **Interactive learning** with real-time feedback
- **Peer support system** and study partnerships

### 📚 **Comprehensive Learning Paths**
- **Structured progression** from alphabet to literature
- **Self-paced solo learning** or instructor-guided paths
- **Cultural integration** in every lesson
- **Interactive exercises** and multimedia content
- **Progress tracking** with detailed analytics

### 🏆 **Professional Certification**
- **Internationally recognized certificates** for career advancement
- **Skill-based assessments** and competency tracking
- **LinkedIn integration** for professional profiles
- **Portfolio building** with verifiable credentials
- **Multiple proficiency levels** (A1-C2 European framework)

### 🏛️ **Greek Cultural Immersion**
- **Ancient mythology** and historical context
- **Traditional music and arts** appreciation
- **Regional dialects** and local customs
- **Virtual cultural events** and festivals
- **Interactive cultural map** of Greece

### 💬 **Vibrant Learning Community**
- **Discussion forums** by skill level and interests
- **Language exchange** partner matching
- **Native speaker mentorship** programs
- **24/7 community support** and encouragement
- **Study groups** and practice sessions

## 🎯 Subscription Plans (Honey-Sweet Pricing! 🍯)

### 🆓 **Free Forever** - $0/month
- ✅ **3 AI tutor sessions** per month
- ✅ **Basic alphabet course** and pronunciation
- ✅ **Community forum access** and support
- ✅ **Progress tracking** and achievements
- ✅ **Cultural exploration** modules

### 💎 **Pro Plan** - $19/month
- ✅ **50 AI tutor sessions** per month
- ✅ **Premium learning content** and advanced lessons
- ✅ **Live cohort classes** with expert instructors
- ✅ **Email support** with priority response
- ✅ **Grammar mastery** tools and exercises
- ✅ **Cultural immersion** experiences

### 👑 **Premium Plan** - $39/month
- ✅ **Unlimited AI tutor sessions** 24/7
- ✅ **1-on-1 instructor sessions** for personalized learning
- ✅ **Professional certification** pathway
- ✅ **Priority support** with dedicated assistance
- ✅ **Business Greek** and specialized vocabulary
- ✅ **Ancient Greek** introduction courses

### 💰 **Annual Savings**
- **🌟 Pro Annual:** $182.40/year **(20% savings!)**
- **🏆 Premium Annual:** $351/year **(25% savings!)**

## 🛠️ Modern Tech Stack

- **⚡ Framework:** Next.js 14+ with App Router and React Server Components
- **🔷 Language:** TypeScript for end-to-end type safety
- **🗄️ Database:** SQLite (dev) / PostgreSQL (production) with Drizzle ORM
- **🔐 Authentication:** NextAuth.js with 5 OAuth providers
- **🎨 Styling:** Tailwind CSS with custom honey/gold design system
- **🧩 UI Components:** Shadcn/ui with custom honey-themed styling
- **🔗 API:** tRPC for type-safe client-server communication
- **💳 Payments:** Stripe integration ready for activation
- **📱 PWA:** Progressive Web App capabilities for mobile experience

## 🏗️ Robust Database Architecture

**19 comprehensive tables** supporting all platform features:

### **User Management**
- `users` - Complete user profiles with onboarding preferences
- `accounts` - OAuth provider account linking
- `sessions` - Secure session management
- `verificationTokens` - Email verification system

### **Learning Engine**
- `learningPaths` - Structured learning curricula
- `modules` - Course modules and chapters
- `lessons` - Individual lesson content and media
- `userProgress` - Detailed progress tracking
- `tutorSessions` - AI conversation history and analytics

### **Business Logic**
- `subscriptionPlans` - Flexible pricing tiers
- `userSubscriptions` - Active subscription management
- `onboardingResponses` - User preference collection

### **Community Features**
- `cohorts` - Live learning group management
- `cohortMembers` - Group membership and roles
- `messages` - Community messaging system
- `resources` - Curated learning materials
- `alerts` - System notifications and updates

## 🚀 Quick Start Guide

### 📋 Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm or yarn** package manager
- **Git** for version control

### ⚡ Lightning-Fast Setup

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/yourusername/melimou.git
   cd melimou
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   **Configure your `.env` file:**
   ```env
   # Database
   DATABASE_URL="file:./sqlite.db"
   
   # NextAuth Configuration
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers (Optional for development)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   TWITTER_CLIENT_ID="your-twitter-client-id"
   TWITTER_CLIENT_SECRET="your-twitter-client-secret"
   INSTAGRAM_CLIENT_ID="your-instagram-client-id"
   INSTAGRAM_CLIENT_SECRET="your-instagram-client-secret"
   LINKEDIN_CLIENT_ID="your-linkedin-client-id"
   LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
   
   # Stripe (Optional)
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. **Database Setup**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:migrate   # Apply migrations
   npm run db:seed      # Seed with sample data
   ```

5. **Launch Development Server**
   ```bash
   npm run dev
   ```

6. **🎉 Start Exploring!**
   - **Open:** `http://localhost:3000`
   - **Explore:** All feature pages without sign-up required
   - **Experience:** The sweet honey-themed learning platform
   - **Test:** OAuth providers with your credentials

## 🌟 Platform Highlights

### ✨ **User Experience Excellence**
- **🚫 No signup barriers** - Explore every feature freely
- **🍯 Sweet branding** - Consistent honey theme throughout
- **📱 Mobile-first** - Responsive design for all devices
- **⚡ Lightning fast** - Optimized performance and loading

### 🎓 **Educational Innovation**
- **🤖 AI-powered** - Cutting-edge language learning technology
- **👨‍🏫 Expert instruction** - Native speakers and certified teachers
- **🏛️ Cultural depth** - Learn language through Greek heritage
- **🏆 Professional certification** - Career-advancing credentials

### 🔧 **Developer Experience**
- **📝 TypeScript everywhere** - Full type safety
- **🔗 tRPC integration** - End-to-end type safety
- **🎨 Tailwind CSS** - Utility-first styling
- **🧪 Modern tooling** - Latest Next.js features

## 📸 Screenshots

*Coming soon: Beautiful screenshots showcasing the honey-themed interface!*

## 🤝 Contributing

We welcome contributions to make MeliMou even sweeter! 🍯

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/sweet-new-feature`)
3. **Commit your changes** (`git commit -m 'Add some sweet feature'`)
4. **Push to the branch** (`git push origin feature/sweet-new-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Greek language experts** for cultural authenticity
- **Next.js team** for the amazing framework
- **Shadcn** for the beautiful UI components
- **Our beta testers** for valuable feedback

---

**🍯 Made with love and honey by the MeliMou team**

*Καλή μάθηση! (Happy Learning!)*
