import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required to run the seed script.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // User 1: Primary Account
  const user1 = await prisma.user.upsert({
    where: { email: 'ehaab@example.com' },
    update: {},
    create: {
      email: 'ehaab@example.com',
      name: 'Ehaab Ullah',
      passwordHash: '$2b$10$e8.Z5s1gP92s01xK98j9ze.x89Y/1z.8Kx38vL92e01', // Example bcrypt hash
      avatarUrl: 'https://avatar.vercel.sh/ehaab',
    },
  });

  // User 2: Teammate Account
  const user2 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah A',
      passwordHash: '$2b$10$e8.Z5s1gP92s01xK98j9ze.x89Y/1z.8Kx38vL92e01',
      avatarUrl: 'https://avatar.vercel.sh/sarah',
    },
  });

  // Project 1
  const project = await prisma.project.upsert({
    where: { slug: 'sprintflow-redesign' },
    update: {},
    create: {
      name: 'SprintFlow Redesign',
      slug: 'sprintflow-redesign',
      description: 'Premium SaaS UI/UX overhaul',
      status: 'ACTIVE',
      ownerId: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'OWNER' },
          { userId: user2.id, role: 'MEMBER' },
        ],
      },
    },
  });

  // Ensure project members exist if project was already present
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: user1.id,
      },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: user1.id,
      role: 'OWNER',
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: user2.id,
      },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: user2.id,
      role: 'MEMBER',
    },
  });

  // Sprint 1 (Idempotent lookup)
  let sprint = await prisma.sprint.findFirst({
    where: {
      projectId: project.id,
      name: 'Sprint 1',
    },
  });

  if (!sprint) {
    sprint = await prisma.sprint.create({
      data: {
        name: 'Sprint 1',
        goal: 'Initial setup and database schema validation',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        projectId: project.id,
      },
    });
  }

  // Story 1 (Idempotent lookup)
  let story1 = await prisma.story.findFirst({
    where: {
      projectId: project.id,
      title: 'Setup PostgreSQL & Prisma',
    },
  });

  if (!story1) {
    story1 = await prisma.story.create({
      data: {
        title: 'Setup PostgreSQL & Prisma',
        description: 'Implement multi-tenant Prisma database schema',
        status: 'DONE',
        priority: 'HIGH',
        points: 5,
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: user1.id,
      },
    });
  }

  // Story 2 (Idempotent lookup)
  let story2 = await prisma.story.findFirst({
    where: {
      projectId: project.id,
      title: 'Design Agile Board Architecture',
    },
  });

  if (!story2) {
    story2 = await prisma.story.create({
      data: {
        title: 'Design Agile Board Architecture',
        description: 'Prepare frontend architecture for Kanban and Scrum views',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        points: 8,
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: user2.id,
      },
    });
  }

  // Tasks (Idempotent lookups)
  const task1Exists = await prisma.task.findFirst({
    where: {
      projectId: project.id,
      title: 'Create schema.prisma file',
    },
  });

  if (!task1Exists) {
    await prisma.task.create({
      data: {
        title: 'Create schema.prisma file',
        description: 'Define 11 required core models with UUID keys',
        status: 'DONE',
        priority: 'HIGH',
        points: 2,
        projectId: project.id,
        sprintId: sprint.id,
        storyId: story1.id,
        assigneeId: user1.id,
      },
    });
  }

  const task2Exists = await prisma.task.findFirst({
    where: {
      projectId: project.id,
      title: 'Verify Prisma validation and build',
    },
  });

  if (!task2Exists) {
    await prisma.task.create({
      data: {
        title: 'Verify Prisma validation and build',
        description: 'Run validate, generate, lint, type-check, and build',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        points: 3,
        projectId: project.id,
        sprintId: sprint.id,
        storyId: story1.id,
        assigneeId: user1.id,
      },
    });
  }

  const task3Exists = await prisma.task.findFirst({
    where: {
      projectId: project.id,
      title: 'Design Kanban Column UI',
    },
  });

  if (!task3Exists) {
    await prisma.task.create({
      data: {
        title: 'Design Kanban Column UI',
        description: 'Draft layout components for drag and drop columns',
        status: 'TODO',
        priority: 'MEDIUM',
        points: 5,
        projectId: project.id,
        sprintId: sprint.id,
        storyId: story2.id,
        assigneeId: user2.id,
      },
    });
  }

  // Bug (Idempotent lookup)
  const bugExists = await prisma.bug.findFirst({
    where: {
      projectId: project.id,
      title: 'Seed script execution guard check',
    },
  });

  if (!bugExists) {
    await prisma.bug.create({
      data: {
        title: 'Seed script execution guard check',
        description: 'Ensure seed script fails gracefully if DATABASE_URL is not set',
        status: 'NEW',
        severity: 'LOW',
        environment: 'Development',
        projectId: project.id,
        sprintId: sprint.id,
        assigneeId: user2.id,
      },
    });
  }

  console.log('Database seed check completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
