import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import {
  Category,
  CreateCategoryDto,
  FilterCategoriesDto,
} from "@/types/Category.type"; // <-- create this types file

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const categoryService = {
  /** GET all categories with optional filters */
  getAll: (query?: FilterCategoriesDto) => {
    const params = query
      ? "?" + new URLSearchParams(query as any).toString()
      : "";
    return fetcher<ApiResponse<Category[]>>(
      `${ENDPOINTS.category.all}${params}`,
      { method: "GET" }
    );
  },

  /** GET single category by ID */
  getOne: (id: number) =>
    fetcher<ApiResponse<Category>>(ENDPOINTS.category.getOne(id), {
      method: "GET",
    }),

  /** CREATE a new category */
  create: (data: CreateCategoryDto) =>
    fetcher<ApiResponse<Category>>(ENDPOINTS.category.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** UPDATE category by ID */
  update: (id: number, data: Partial<CreateCategoryDto>) =>
    fetcher<ApiResponse<Category>>(ENDPOINTS.category.update(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /** DELETE category by ID */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(ENDPOINTS.category.remove(id), {
      method: "DELETE",
    }),

  /** GET category stats */
  getStats: () =>
    fetcher<ApiResponse<any>>(ENDPOINTS.category.stats, { method: "GET" }),
};
