import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";
import {
  SavingsGoal,
  CreateSavingsGoalDto,
  UpdateSavingsGoalDto,
} from "@/types/SavingsGoal.type";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const savingsGoalsService = {
  /** CREATE a new savings goal */
  create: (data: CreateSavingsGoalDto) =>
    fetcher<ApiResponse<SavingsGoal>>(API_ENDPOINTS.savingsGoals.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** GET all my savings goals */
  my: () =>
    fetcher<ApiResponse<SavingsGoal[]>>(API_ENDPOINTS.savingsGoals.my, {
      method: "GET",
    }),

  /** GET single savings goal by ID */
  getOne: (id: number) =>
    fetcher<ApiResponse<SavingsGoal>>(API_ENDPOINTS.savingsGoals.getOne(id), {
      method: "GET",
    }),

  /** UPDATE a savings goal */
  update: (id: number, data: UpdateSavingsGoalDto) =>
    fetcher<ApiResponse<SavingsGoal>>(API_ENDPOINTS.savingsGoals.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** DELETE a savings goal */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(API_ENDPOINTS.savingsGoals.remove(id), {
      method: "DELETE",
    }),
};
