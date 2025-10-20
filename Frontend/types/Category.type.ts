import { ApiResponse } from "./ApiResponse.type";

// ownership can be 'system' (default categories) or 'user' (created by a user)
export type CategoryOwnership = "system" | "user";

// category type can be 'income' or 'expense'
export type CategoryType = "income" | "expense";

// Type for creating a category
export interface CreateCategoryDto {
  name: string;
  displayName: string;
  type: CategoryType;
}

// Type for filtering categories
export interface FilterCategoriesDto {
  ownership?: CategoryOwnership;
  categoryType?: CategoryType;
}

// Full Category type including optional user info
export interface User {
  id: number;
  email: string | null;
  username: string;
  password: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  user: User | null;
  name: string;
  displayName: string;
  type: CategoryType;
  createdAt: string;
}

export interface CategoryStats {
  total: number;
  income: {
    total: number;
    system: number;
    user: number;
  };
  expense: {
    total: number;
    system: number;
    user: number;
  };
}

export interface CategoryState {
  categories: Category[];
  categoryStats: CategoryStats;

  setCategories: (categories: Category[]) => void;
  setCategoryStats: (categoryStats: CategoryStats) => void;

  // return ApiResponse<Category[]> instead of void
  getAllCategories: (
    params?: FilterCategoriesDto
  ) => Promise<ApiResponse<Category[]>>;

  getCategory: (id: number) => Promise<ApiResponse<Category>>;

  createCategory: (data: CreateCategoryDto) => Promise<ApiResponse<Category>>;
  updateCategory: (
    id: number,
    data: Partial<CreateCategoryDto>
  ) => Promise<ApiResponse<Category>>;
  deleteCategory: (id: number) => Promise<ApiResponse<null>>;

  getCategoryStats: () => Promise<ApiResponse<CategoryStats>>;
}
