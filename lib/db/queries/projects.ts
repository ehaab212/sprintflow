import 'server-only';
import { db } from '@/lib/db';
import { userSafeSelect } from '@/lib/db/queries/users';
import { slugify } from '@/lib/utils';
import type { ProjectRole, ProjectStatus } from '@prisma/client';
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validations/project';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Retrieve all projects accessible to a user (as owner or team member).
 */
export async function getUserProjects(userId: string) {
  if (!userId) return [];

  return db.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      owner: { select: userSafeSelect },
      members: {
        include: {
          user: { select: userSafeSelect },
        },
      },
      tasks: {
        select: {
          id: true,
          status: true,
        },
      },
      _count: {
        select: {
          tasks: true,
          stories: true,
          bugs: true,
          sprints: true,
          members: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Retrieve a project by ID or slug only if the user is authorized (owner or member).
 * Returns null if not found or unauthorized to prevent information leakage.
 */
export async function getAuthorizedProject(idOrSlug: string, userId: string) {
  if (!idOrSlug || !userId) return null;

  const isUuid = UUID_REGEX.test(idOrSlug);

  const project = await db.project.findFirst({
    where: isUuid
      ? { OR: [{ id: idOrSlug }, { slug: idOrSlug }] }
      : { slug: idOrSlug },
    include: {
      owner: { select: userSafeSelect },
      members: {
        include: {
          user: { select: userSafeSelect },
        },
      },
      sprints: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          points: true,
          priority: true,
        },
      },
      _count: {
        select: {
          tasks: true,
          stories: true,
          bugs: true,
          sprints: true,
          members: true,
        },
      },
    },
  });

  if (!project) return null;

  // Authorization check: User must be project owner or member
  const isOwner = project.ownerId === userId;
  const isMember = project.members.some((m) => m.userId === userId);

  if (!isOwner && !isMember) {
    return null;
  }

  return project;
}

/**
 * Check if a user is a member or owner of a project.
 */
export async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
  if (!projectId || !userId) return false;

  const member = await db.projectMember.findFirst({
    where: {
      projectId,
      userId,
    },
    select: { id: true },
  });

  if (member) return true;

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  return project?.ownerId === userId;
}

/**
 * Get a user's role within a project.
 * Returns null if the project does not exist or user is not a member.
 */
export async function getProjectMemberRole(projectId: string, userId: string): Promise<ProjectRole | null> {
  if (!projectId || !userId) return null;

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return null;

  if (project.ownerId === userId) {
    return 'OWNER';
  }

  const member = await db.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    select: { role: true },
  });

  return member?.role ?? null;
}

/**
 * Generate a unique slug for a project.
 * If base slug is already taken, appends incremental suffix.
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name) || 'project';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.project.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Create a new project and add the creator as OWNER in an atomic transaction.
 */
export async function createProject(
  data: CreateProjectInput,
  ownerId: string
) {
  const slug = await generateUniqueSlug(data.name);

  return db.$transaction(async (tx) => {
    // 1. Create the project record
    const project = await tx.project.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description && data.description.trim() ? data.description.trim() : null,
        status: 'ACTIVE',
        ownerId,
      },
    });

    // 2. Add owner to ProjectMember with OWNER role
    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: ownerId,
        role: 'OWNER',
      },
    });

    // 3. Record audit activity
    await tx.activity.create({
      data: {
        projectId: project.id,
        userId: ownerId,
        action: 'PROJECT_CREATED',
        targetId: project.id,
        targetType: 'Project',
      },
    });

    return project;
  });
}

/**
 * Update project details (name, description, status).
 * Requires OWNER or ADMIN role.
 */
export async function updateProject(
  projectId: string,
  data: UpdateProjectInput,
  userId: string
) {
  const role = await getProjectMemberRole(projectId, userId);

  if (role !== 'OWNER' && role !== 'ADMIN') {
    throw new Error('Unauthorized: Only project Owners and Admins can update project settings.');
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.project.update({
      where: { id: projectId },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.description !== undefined && { 
          description: data.description && data.description.trim() ? data.description.trim() : null 
        }),
        ...(data.status !== undefined && { status: data.status as ProjectStatus }),
      },
    });

    await tx.activity.create({
      data: {
        projectId,
        userId,
        action: 'PROJECT_UPDATED',
        targetId: projectId,
        targetType: 'Project',
      },
    });

    return updated;
  });
}
