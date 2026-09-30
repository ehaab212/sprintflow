'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { registerSchema, loginSchema } from '@/lib/validations/auth';
import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';

export interface ActionResponse {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function registerUser(rawData: unknown): Promise<ActionResponse> {
  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message);
    }
    return {
      success: false,
      error: 'Please verify the highlighted fields.',
      fieldErrors,
    };
  }

  const { name, email, password } = validation.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      };
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl: `https://avatar.vercel.sh/${encodeURIComponent(name)}`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Registration server action error:', error);
    return {
      success: false,
      error: 'An error occurred while creating your account. Please try again.',
    };
  }
}

export async function loginUser(rawData: unknown): Promise<ActionResponse> {
  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: 'Please provide a valid email and password.',
    };
  }

  const { email, password } = validation.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Invalid email or password. Please try again.',
          };
        default:
          return {
            success: false,
            error: 'Authentication failed. Please check your credentials.',
          };
      }
    }

    // For any unhandled error
    console.error('Login action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during login. Please try again.',
    };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
