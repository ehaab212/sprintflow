# SprintFlow

SprintFlow is a modern, full-stack Agile project-management SaaS application designed for software teams. It provides a clean, secure, and scalable workspace to manage the complete Scrum lifecycle—from product backlogs and sprint planning to interactive Kanban workflows.

## Features (Roadmap)
- Authentication & Role-Based Access Control
- Database & Data-Access Foundation (Prisma 7 + PostgreSQL on Neon)
- Projects & Team Management
- Backlog & Sprint Planning
- Interactive Kanban Board
- Bug Tracking
- Analytics & Burndown Charts

## Technology Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions & Route Handlers
- **Database**: PostgreSQL (Neon) with Prisma ORM (v7.10) & `@prisma/adapter-pg`
- **Validation**: Zod & React Hook Form
- **Deployment**: Vercel
- **Monitoring**: Sentry

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sprintflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your Neon PostgreSQL connection string in `DATABASE_URL` and provide a secure `AUTH_SECRET`.

4. **Initialize and validate database**
   Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
   Verify migration status against your database:
   ```bash
   npx prisma migrate status
   ```

5. **(Optional) Seed demo data**
   To populate initial development data (idempotent, safe mock accounts):
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Architecture Note
This project emphasizes server-side business logic and strict TypeScript typing.
- Database access is strictly decoupled into a server-only data-access foundation in `lib/db/` using the `@prisma/adapter-pg` connection pool.
- All UI components are Server Components by default, except where user interactivity requires Client Components.
- Mutations are executed via Server Actions validated with Zod schemas.
