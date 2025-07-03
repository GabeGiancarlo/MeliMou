# 🇬🇷 MeliMou - Greek Language Learning Platform

**Καλώς ήρθατε στο MeliMou!** (Welcome to MeliMou!)

A comprehensive Greek language learning web application built with cutting-edge technologies. MeliMou provides personalized learning paths, real-time chat, AI tutoring, and comprehensive resources for Greek language learners at all levels.

![MeliMou Platform](https://img.shields.io/badge/Platform-Greek_Language_Learning-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎯 **Core Learning Features**
- **📊 Interactive Dashboard**: Progress tracking, upcoming lessons, recent alerts, and quick actions
- **📚 Structured Learning Paths**: 
  - 🎯 **Solo Path**: Self-paced modules for independent learning
  - 👥 **Cohort Path**: Structured group learning with instructor guidance
- **💬 Real-time Chat**: Connect with fellow students and instructors in dedicated channels
- **🔔 Smart Alert System**: System notifications, instructor announcements, and achievements
- **📖 Resource Library**: Curated Greek materials with advanced search and tagging
- **🤖 AI Conversational Tutor**: Practice Greek with AI-powered tutoring supporting:
  - Informal, formal, and mixed conversation levels
  - Authentic Greek responses with cultural context
  - Progressive difficulty adjustment

### 🌙 **Design & UX**
- **🎨 Beautiful Dark Mode**: Professional dark theme optimized for learning
- **📱 Responsive Design**: Perfect experience across all devices
- **🎭 Greek Cultural Integration**: Authentic Greek phrases and cultural context
- **⚡ Lightning Fast**: Optimized performance with React Server Components

### 🏛️ **Greek Language Focus**
- **📝 Alphabet to Advanced**: From basic Greek letters to complex conversations
- **🏺 Cultural Immersion**: Learn about Greek mythology, philosophy, and modern culture
- **🌊 Travel Preparation**: Practical phrases for Greek island adventures
- **🍯 Modern Greek**: Contemporary language skills for real-world communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- SQLite (for development) or PostgreSQL (for production)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/MeliMou.git
cd MeliMou
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Configure your `.env` file:
```env
# Database - SQLite for development
DATABASE_URL="file:./sqlite.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

4. **Set up the database**:
```bash
npm run db:push
```

5. **Start the development server**:
```bash
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000) to see your Greek learning platform!**

## 🏗️ Technology Stack

### **Frontend**
- **Next.js 14+** with App Router
- **React Server Components** for optimal performance
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui + Radix UI** for components

### **Backend**
- **tRPC** for type-safe API calls
- **Drizzle ORM** with SQLite/PostgreSQL
- **NextAuth.js** for authentication
- **Server Actions** for seamless UX

### **Development**
- **Vitest** for unit testing
- **Cypress** for E2E testing
- **ESLint** for code quality
- **Prettier** for formatting

## 📊 Database Schema

Comprehensive schema supporting all learning features:

```
Users (with roles & preferences)
├── Learning Paths → Modules → Lessons
├── Cohorts ↔ Cohort Members
├── User Progress (completion tracking)
├── Messages (real-time chat)
├── Resources (tagged materials)
├── Alerts (notifications)
├── Tutor Sessions → Tutor Messages
└── Authentication (NextAuth tables)
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate database schema
npm run db:push         # Push schema to database
npm run db:studio       # Open database studio

# Testing & Quality
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
```

## 📁 Project Structure

```
MeliMou/
├── 📱 src/app/                    # Next.js App Router
│   ├── 📊 dashboard/             # Learning dashboard
│   ├── 💬 chat/                  # Community chat
│   ├── 🔔 alerts/                # Notification system
│   ├── 📖 resources/             # Resource library
│   ├── 📚 learning-paths/        # Learning paths
│   ├── 🤖 tutor/                 # AI tutor interface
│   └── 🧩 components/            # App components
├── 🎨 src/components/            # Reusable UI components
│   ├── 🎯 ui/                    # Base UI (Shadcn)
│   ├── 📚 learning-path/         # Learning components
│   ├── 💬 chat-panel/            # Chat components
│   ├── 🔔 alert-system/          # Alert components
│   ├── 📖 resource-library/      # Resource components
│   └── 🤖 tutor-interface/       # Tutor components
├── 🔧 src/server/                # Server-side code
│   ├── 🚀 api/                   # tRPC routers
│   └── 💾 db/                    # Database schema
├── 📦 src/lib/                   # Shared utilities
└── 🎨 src/styles/                # Global styles
```

## 🌐 API Routes

**tRPC Routers**:
- `learningPath`: CRUD operations for learning paths
- `lesson`: Lesson management and progress tracking
- `chat`: Real-time messaging system
- `alert`: Notification management
- `resource`: Resource library operations
- `tutor`: AI tutoring sessions

## 🚀 Deployment

### **Environment Variables for Production**
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
```

### **Deployment Steps**
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npm run db:push`
4. Build the application: `npm run build`
5. Deploy to your preferred platform

## 🧪 Testing

### **Unit Tests**
```bash
npm run test
```

### **E2E Tests**
```bash
npm run test:e2e
```

**Critical Tests**: All core learning flow tests must pass for deployment.

## 🎯 Performance

- ⚡ **Server-side rendering** with React Server Components
- 🔄 **Lazy loading** for optimal performance
- 🖼️ **Image optimization** with Next.js Image component
- 📱 **Mobile-first** responsive design
- 🎨 **Web Vitals** optimization

## 🔮 Future Enhancements

- [ ] **Real AI Integration** (currently using mock responses)
- [ ] **Payment/Subscription System**
- [ ] **Mobile App Development**
- [ ] **Advanced Analytics Dashboard**
- [ ] **Multi-language Interface Support**
- [ ] **Voice Recognition for Pronunciation**
- [ ] **Gamification Elements**

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. 📝 **Conventional Commits** for commit messages
2. 📏 **TypeScript Strict Mode** compliance
3. ✅ **Zero ESLint Warnings**
4. 🧪 **Add Tests** for new features
5. 📚 **Update Documentation** as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and community support
- **Email**: [Your email for direct contact]

## 🎉 Acknowledgments

- Built with love for the Greek language learning community
- Inspired by the rich cultural heritage of Greece
- Thanks to all contributors and the open-source community

---

**Μπράβο!** (Well done!) You're ready to start your Greek learning journey with MeliMou! 🇬🇷✨
