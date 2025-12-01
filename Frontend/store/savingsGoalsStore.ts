import { create } from "zustand";
import { savingsGoalsService } from "@/services/savingsGoalsService";
import {
  SavingsGoal,
  CreateSavingsGoalDto,
  UpdateSavingsGoalDto,
} from "@/types/SavingsGoal.type";

interface SavingsGoalState {
  goals: SavingsGoal[];
  setGoals: (goals: SavingsGoal[]) => void;

  // Actions
  getMyGoals: () => Promise<any>;
  getGoal: (id: number) => Promise<any>;
  createGoal: (data: CreateSavingsGoalDto) => Promise<any>;
  updateGoal: (id: number, data: UpdateSavingsGoalDto) => Promise<any>;
  deleteGoal: (id: number) => Promise<any>;
}

export const useSavingsGoalsStore = create<SavingsGoalState>((set, get) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),

  /** GET: My savings goals */
  getMyGoals: async () => {
    const res = await savingsGoalsService.my();
    if (res.success) set({ goals: res.data });
    return res;
  },

  /** GET: Single savings goal */
  getGoal: async (id) => {
    const res = await savingsGoalsService.getOne(id);
    return res;
  },

  /** POST: Create savings goal */
  createGoal: async (data) => {
    const res = await savingsGoalsService.create(data);
    if (res.success) {
      set({ goals: [res.data, ...(get().goals || [])] });
    }
    return res;
  },

  /** PATCH: Update savings goal */
  updateGoal: async (id, data) => {
    const res = await savingsGoalsService.update(id, data);
    if (res.success) {
      set({
        goals: (get().goals || []).map((g) => (g.id === id ? res.data : g)),
      });
    }
    return res;
  },

  /** DELETE: Remove savings goal */
  deleteGoal: async (id) => {
    const res = await savingsGoalsService.remove(id);
    if (res.success) {
      set({ goals: (get().goals || []).filter((g) => g.id !== id) });
    }
    return res;
  },
}));
