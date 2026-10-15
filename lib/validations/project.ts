import { z } from 'zod';

export const projectStatusEnum = z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']);

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(60, 'Project name cannot exceed 60 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(60, 'Project name cannot exceed 60 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  status: projectStatusEnum.optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
