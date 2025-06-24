# MeliMou - Greek Language Learning Platform

A comprehensive Greek language learning web application built with Next.js, TypeScript, tRPC, and Prisma. MeliMou provides personalized learning paths, real-time chat, AI tutoring, and comprehensive resources for Greek language learners.

## Features

### 🎯 Core Features
- **Dashboard**: Progress tracking, upcoming lessons, recent alerts, and quick actions
- **Learning Paths**: 
  - Solo Path: Self-paced modules for independent learning
  - Cohort Path: Structured group learning with instructor guidance
- **Real-time Chat**: Connect with fellow students and instructors
- **Alert System**: System notifications, instructor announcements, and achievements
- **Resource Library**: Curated links, PDFs, videos with search and tagging
- **AI Conversational Tutor**: Practice Greek with AI-powered tutoring (voice/text support)

### 🏗️ Architecture
- **Frontend**: Next.js 14+ with App Router, React Server Components
- **Backend**: tRPC for type-safe API calls
- **Database**: Drizzle ORM with PostgreSQL (production) / SQLite (development)
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/ui + Radix UI + Tailwind CSS
- **Testing**: Vitest for unit tests, Cypress for E2E tests

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- PostgreSQL (for production)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd melimou-greek-learning
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure the following environment variables:
- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

4. Set up the database:
\`\`\`bash
npm run db:push
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses the following main entities:

- **Users**: Student, instructor, and admin accounts
- **Learning Paths**: Structured learning curricula
- **Modules**: Groups of related lessons
- **Lessons**: Individual learning units with content
- **Cohorts**: Group learning sessions with instructors
- **Messages**: Real-time chat system
- **Resources**: Learning materials and references
- **Alerts**: Notifications and announcements
- **User Progress**: Tracking lesson completion and scores
- **Tutor Sessions**: AI conversational tutoring sessions

## API Structure

The application uses tRPC for type-safe API calls:

- `learningPath`: CRUD operations for learning paths
- `lesson`: Lesson management and progress tracking
- `chat`: Real-time messaging
- `alert`: Notification system
- `resource`: Resource library management
- `tutor`: AI tutoring sessions

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint (max 0 warnings)
- `npm run db:generate`: Generate database schema
- `npm run db:push`: Push schema changes to database
- `npm run db:studio`: Open database studio
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run E2E tests

## Folder Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── chat/              # Chat interface
│   ├── alerts/            # Alerts management
│   ├── resources/         # Resource library
│   ├── learning-paths/    # Learning paths
│   └── tutor/             # AI tutor interface
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components (Shadcn)
│   ├── learning-path/     # Learning path components
│   ├── chat-panel/        # Chat components
│   ├── alert-system/      # Alert components
│   ├── resource-library/  # Resource components
│   └── tutor-interface/   # Tutor components
├── server/                # Server-side code
│   ├── api/               # tRPC routers
│   └── db/                # Database schema and config
├── lib/                   # Shared utilities
└── styles/                # Global styles
\`\`\`

## Deployment

### Production Environment Variables

Ensure the following environment variables are set in production:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secure random string
- `NEXTAUTH_URL`: Your production URL

### Database Migration

For production deployment:

1. Set up PostgreSQL database
2. Configure `DATABASE_URL` environment variable
3. Run database migrations:
\`\`\`bash
npm run db:push
\`\`\`

## Testing

### Unit Tests
\`\`\`bash
npm run test
\`\`\`

### E2E Tests
\`\`\`bash
npm run test:e2e
\`\`\`

Critical test: "user completes lesson 1" must pass for deployment.

## Performance Optimizations

- Server-side rendering with React Server Components
- Lazy loading for non-critical components
- Image optimization with WebP format
- Web Vitals optimization (LCP, CLS, FID)
- Mobile-first responsive design

## Future Enhancements

- Real AI integration (currently using mock responses)
- Payment/subscription system
- Mobile app development
- Advanced analytics and reporting
- Multi-language support for interface

## Contributing

1. Follow conventional commits for commit messages
2. Ensure TypeScript strict mode compliance
3. Maintain zero ESLint warnings
4. Add tests for new features
5. Update documentation as needed

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
