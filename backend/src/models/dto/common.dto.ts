export type Pagination = {
  page: number;
  limit: number;
}

export type PaginationQuery = {
  page: string;
  limit: string;
}

export function paginationTransformer(src: PaginationQuery): Pagination {
  return {
    page: parseInt(src.page) || 1,
    limit: parseInt(src.limit) || 10,
  }
}