// store/categoryStore.ts
import { create } from "zustand";
import { categoryService } from "@/services/categoryService";
import { CreateCategoryDto, CategoryState } from "@/types/Category.type";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),

  categoryStats: {
    total: 0,
    income: { total: 0, system: 0, user: 0 },
    expense: { total: 0, system: 0, user: 0 },
  },
  setCategoryStats: (categoryStats) => set({ categoryStats }),

  getAllCategories: async (params) => {
    const res = await categoryService.getAll(params);
    if (res.success) set({ categories: res.data });
    return res;
  },

  getCategory: async (id) => {
    const res = await categoryService.getOne(id);
    return res;
  },

  createCategory: async (data: CreateCategoryDto) => {
    const res = await categoryService.create(data);
    if (res.success) {
      set({ categories: [res.data!, ...(get().categories || [])] });
    }
    return res;
  },

  updateCategory: async (id, data) => {
    const res = await categoryService.update(id, data);
    if (res.success) {
      set({
        categories: (get().categories || []).map((c) =>
          c.id === id ? res.data : c
        ),
      });
    }
    return res;
  },

  deleteCategory: async (id) => {
    const res = await categoryService.remove(id);
    if (res.success) {
      set({ categories: (get().categories || []).filter((c) => c.id !== id) });
      return res;
    }
    return res;
  },

  getCategoryStats: async () => {
    const res = await categoryService.getStats();
    if (res.success && res.data) set({ categoryStats: res.data });
    return res;
  },
}));
