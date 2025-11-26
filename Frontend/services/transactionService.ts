import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import {
  CreateTransactionDto,
  FindTransactionsDto,
  Transaction,
  BulkCreateTransaction,
  Statement,
} from "@/types/Transaction.type"; // <-- make a types file for these

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export const transactionService = {
  /** GET all transactions with optional query params */
  getAll: (accountId: number, query?: FindTransactionsDto) => {
    const params = query
      ? "?" + new URLSearchParams(query as any).toString()
      : "";
    return fetcher<ApiResponse<any>>(
      `${ENDPOINTS.transaction.getAll(accountId)}${params}`,
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
  createBulk: (data: BulkCreateTransaction) =>
    fetcher<ApiResponse<Transaction[]>>(ENDPOINTS.transaction.createBulk, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** UPDATE transaction by ID */
  update: (id: number, data: Partial<CreateTransactionDto>) =>
    fetcher<ApiResponse<Transaction>>(ENDPOINTS.transaction.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** DELETE transaction by ID */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(ENDPOINTS.transaction.remove(id), {
      method: "DELETE",
    }),

  getStatements: (accountId: number, params: { from: string; to: string }) =>
    fetcher<ApiResponse<Statement>>(
      `${ENDPOINTS.transaction.statements(accountId)}?from=${params.from}&to=${
        params.to
      }`,
      {
        method: "GET",
      }
    ),
};
