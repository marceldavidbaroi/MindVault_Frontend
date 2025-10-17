import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import {
  CreateTransactionDto,
  BulkTransactionDto,
  FindTransactionsDto,
  Transaction,
} from "@/types/Transaction.type"; // <-- make a types file for these

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

export const transactionService = {
  /** GET all transactions with optional query params */
  getAll: (query?: FindTransactionsDto) => {
    const params = query
      ? "?" + new URLSearchParams(query as any).toString()
      : "";
    return fetcher<ApiResponse<Transaction[]>>(
      `${ENDPOINTS.transaction.all}${params}`,
      { method: "GET" }
    );
  },

  /** GET single transaction by ID */
  getOne: (id: number) =>
    fetcher<ApiResponse<Transaction>>(ENDPOINTS.transaction.getOne(id), {
      method: "GET",
    }),

  /** CREATE a new transaction */
  create: (data: CreateTransactionDto) =>
    fetcher<ApiResponse<Transaction>>(ENDPOINTS.transaction.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** BULK CREATE transactions */
  createBulk: (data: BulkTransactionDto) =>
    fetcher<ApiResponse<Transaction[]>>(ENDPOINTS.transaction.createBulk, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** UPDATE transaction by ID */
  update: (id: number, data: Partial<CreateTransactionDto>) =>
    fetcher<ApiResponse<Transaction>>(ENDPOINTS.transaction.update(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /** DELETE transaction by ID */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(ENDPOINTS.transaction.remove(id), {
      method: "DELETE",
    }),
};
