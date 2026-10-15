import 'server-only';
import { db } from '@/lib/db';

export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Retrieve a user by ID with sensitive fields (like passwordHash) excluded.
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  if (!id) return null;
  return db.user.findUnique({
    where: { id },
    select: userSafeSelect,
  });
}

/**
 * Retrieve a user by Email with sensitive fields excluded.
 */
export async function getUserByEmail(email: string): Promise<SafeUser | null> {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();
  return db.user.findUnique({
    where: { email: normalizedEmail },
    select: userSafeSelect,
  });
}

/**
 * Server-only helper to fetch a user with passwordHash for authentication checks.
 */
export async function getUserWithAuthByEmail(email: string) {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();
  return db.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      ...userSafeSelect,
      passwordHash: true,
    },
  });
}
