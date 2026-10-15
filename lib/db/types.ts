/**
 * Database and query foundation types
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DatabaseError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Safely calculate and clamp pagination boundaries.
 * Enforces page >= 1 and 1 <= pageSize <= 100.
 */
export function calculatePagination(params?: PaginationParams): {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
} {
  const rawPage = Number(params?.page);
  const rawPageSize = Number(params?.pageSize);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 
    ? Math.min(100, Math.floor(rawPageSize)) 
    : 20;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take, page, pageSize };
}
