// store/categoryStore.ts
import { create } from "zustand";
import { categoryService } from "@/services/categoryService";
import { ApiResponse } from "@/types/ApiResponse.type";
import {
  Category,
  CreateCategoryDto,
  FilterCategoriesDto,
  CategoryStats,
  CategoryState,
} from "@/types/Category.type";

// interface CategoryState {
//   categories: Category[];
//   setCategories: (categories: Category[]) => void;

//   categoryStats: CategoryStats;
//   setCategoryStats: (categoryStats: CategoryStats) => void;

//   getAllCategories: (params?: FilterCategoriesDto) => Promise<void>;

//   getCategory: (id: number) => Promise<Category | null>;

//   createCategory: (data: CreateCategoryDto) => Promise<Category | null>;

//   updateCategory: (
//     id: number,
//     data: Partial<CreateCategoryDto>
//   ) => Promise<Category | null>;

//   deleteCategory: (id: number) => Promise<boolean>;

//   getCategoryStats: () => Promise<any | null>;
// }

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),

  categoryStats: {
    total: 0,
    income: {
      total: 0,
      system: 0,
      user: 0,
    },
    expense: {
      total: 0,
      system: 0,
      user: 0,
    },
  },
  setCategoryStats: (categoryStats) => set({ categoryStats }),

  getAllCategories: async (params) => {
    try {
      const res: ApiResponse<Category[]> = await categoryService.getAll(params);
      if (res.success) set({ categories: res.data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  getCategory: async (id) => {
    try {
      const res: ApiResponse<Category> = await categoryService.getOne(id);
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to fetch category:", error);
      return null;
    }
  },

  createCategory: async (data) => {
    try {
      const res: ApiResponse<Category> = await categoryService.create(data);
      if (res.success) {
        set({ categories: [res.data, ...get().categories] });
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to create category:", error);
      return null;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const res: ApiResponse<Category> = await categoryService.update(id, data);
      if (res.success) {
        set({
          categories: get().categories.map((c) => (c.id === id ? res.data : c)),
        });
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to update category:", error);
      return null;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res: ApiResponse<null> = await categoryService.remove(id);
      if (res.success) {
        set({ categories: get().categories.filter((c) => c.id !== id) });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete category:", error);
      return false;
    }
  },

  getCategoryStats: async () => {
    try {
      const res: ApiResponse<any> = await categoryService.getStats();
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to fetch category stats:", error);
      return null;
    }
  },
}));
