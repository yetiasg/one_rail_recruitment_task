export type SortDirection = "asc" | "desc";

export interface FindUsersQuery {
  page?: number;
  pageSize?: number;
  sortBy: "email";
  sortDir: SortDirection;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
