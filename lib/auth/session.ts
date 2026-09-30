import { auth } from '@/lib/auth/index';

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * Server-side helper to retrieve the authenticated user from session
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')) {
      throw error;
    }
    console.error('Error fetching current user:', error);
    return null;
  }
}

