export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type APISuccessResponse<T = null> = {
  status: true;
  data: T;
  message?: string;
};

export type APIErrorResponse = {
  status: false;
  data: null;
  message: string;
};

export type APIResponse<T = null> = APISuccessResponse<T> | APIErrorResponse;
