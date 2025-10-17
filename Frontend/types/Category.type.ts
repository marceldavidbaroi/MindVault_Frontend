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
