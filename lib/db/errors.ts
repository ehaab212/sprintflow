import { Prisma } from '@prisma/client';

export interface FormattedDatabaseError {
  success: false;
  error: string;
  code?: string;
  field?: string;
}

/**
 * Maps database and Prisma errors to safe, user-friendly messages.
 * Prevents raw database connection strings, credentials, SQL queries, or internal schemas from leaking.
 */
export function handleDatabaseError(error: unknown): FormattedDatabaseError {
  // Always log raw error to server logs for debugging
  console.error('[Database Error]:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[]) || [];
        const fieldName = target.length > 0 ? target.join(', ') : 'field';
        return {
          success: false,
          error: `A record with this ${fieldName} already exists.`,
          code: 'P2002',
          field: target[0],
        };
      }
      case 'P2025': {
        return {
          success: false,
          error: 'The requested record was not found.',
          code: 'P2025',
        };
      }
      case 'P2003': {
        return {
          success: false,
          error: 'Operation failed due to a related record constraint.',
          code: 'P2003',
        };
      }
      case 'P1001': {
        return {
          success: false,
          error: 'Unable to reach the database server. Please check your connection.',
          code: 'P1001',
        };
      }
      default: {
        return {
          success: false,
          error: 'A database error occurred. Please try again.',
          code: error.code,
        };
      }
    }
  }

  // Never return raw error.message from generic Errors as it may contain hostnames, SQL, or passwords
  return {
    success: false,
    error: 'An unexpected database error occurred. Please try again.',
  };
}
