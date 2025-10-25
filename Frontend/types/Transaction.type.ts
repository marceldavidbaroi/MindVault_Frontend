// types/transaction.ts

export type TransactionType = "income" | "expense";
export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly";

export interface TransactionCategory {
  id: number;
  name: string;
  displayName: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  category: TransactionCategory;
  amount: string;
  date: string;
  description?: string;
  recurring: boolean;
  recurringInterval?: RecurringInterval | null;
  createdAt: string;
  updatedAt: string;
}

/** DTOs for API requests */

export interface CreateTransactionDto {
  type: TransactionType;
  categoryId: number;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
  description?: string;
  recurring?: boolean;
  recurringInterval?: RecurringInterval;
}

export interface TransactionItemDto {
  categoryId: number;
  amount: number | undefined;
}

export interface BulkTransactionDto {
  date: string; // ISO string
  type: TransactionType;
  transactions: TransactionItemDto[];
}

export interface FindTransactionsDto {
  type?: TransactionType;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SummaryData {
  title: string;
  type: "year" | "month" | "today";
  income: number;
  expense: number;
  prevIncome: number;
  prevExpense: number;
}

export interface TransactionMeta {
  total: number;
  page: number;
  limit: number;
}

/** Generic API response */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TransactionMeta;
}
