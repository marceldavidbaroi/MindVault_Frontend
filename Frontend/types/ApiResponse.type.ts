export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
