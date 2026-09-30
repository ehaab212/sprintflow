import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // User 1: Global Account
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

  // User 2: Global Account
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

  // Sprint 1
  const sprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 1',
      goal: 'Initial setup and database schema validation',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      projectId: project.id,
    },
  });

  // Stories
  const story1 = await prisma.story.create({
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

  const story2 = await prisma.story.create({
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

  // Tasks
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

  // Bug
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

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
