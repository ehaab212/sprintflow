'use server';

import { getCurrentUser } from '@/lib/auth/session';
import { createProject, updateProject, getProjectMemberRole } from '@/lib/db/queries/projects';
import { createProjectSchema, updateProjectSchema } from '@/lib/validations/project';
import { handleDatabaseError } from '@/lib/db/errors';
import { revalidatePath } from 'next/cache';

export interface ProjectActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server action to create a new project.
 * Automatically assigns the authenticated user as the project OWNER.
 */
export async function createProjectAction(rawData: unknown): Promise<ProjectActionResponse<{ id: string; slug: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user?.id) {
    return {
      success: false,
      error: 'You must be signed in to create a project.',
    };
  }

  const validation = createProjectSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message);
    }
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors,
    };
  }

  try {
    const project = await createProject(validation.data, user.id);

    revalidatePath('/projects');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: project.id,
        slug: project.slug,
        name: project.name,
      },
    };
  } catch (error) {
    const dbErr = handleDatabaseError(error);
    return {
      success: false,
      error: dbErr.error,
    };
  }
}

/**
 * Server action to update project settings (name, description, status).
 * Enforces server-side authorization: user must have OWNER or ADMIN role.
 */
export async function updateProjectAction(
  projectId: string,
  rawData: unknown
): Promise<ProjectActionResponse<{ id: string; slug: string }>> {
  const user = await getCurrentUser();

  if (!user?.id) {
    return {
      success: false,
      error: 'You must be signed in to update project settings.',
    };
  }

  if (!projectId) {
    return {
      success: false,
      error: 'Invalid project ID provided.',
    };
  }

  // Server authorization check
  const role = await getProjectMemberRole(projectId, user.id);

  if (role !== 'OWNER' && role !== 'ADMIN') {
    return {
      success: false,
      error: 'You do not have permission to modify settings for this project.',
    };
  }

  const validation = updateProjectSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message);
    }
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors,
    };
  }

  try {
    const updated = await updateProject(projectId, validation.data, user.id);

    revalidatePath('/projects');
    revalidatePath('/dashboard');
    revalidatePath(`/projects/${updated.slug}`);
    revalidatePath(`/projects/${updated.id}`);

    return {
      success: true,
      data: {
        id: updated.id,
        slug: updated.slug,
      },
    };
  } catch (error) {
    const dbErr = handleDatabaseError(error);
    return {
      success: false,
      error: dbErr.error,
    };
  }
}
