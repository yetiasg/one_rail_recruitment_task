export type SortDirection = "asc" | "desc";

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderBy<F extends string> {
  field: F;
  direction: SortDirection;
}

export interface FindPagedRepoResult<T> {
  rows: T[];
  total: number;
}

export interface FindPagedRepoQuery<F extends string> {
  offset: number;
  limit: number;
  orderBy: OrderBy<F>;
}

export function clampInt(value: number, min: number, max: number): number {
  const v = Math.trunc(value);
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
