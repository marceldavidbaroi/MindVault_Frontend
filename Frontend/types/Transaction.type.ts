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
  type: "income" | "expense";
  amount: string;
  transactionDate: string; // YYYY-MM-DD
  description: string | null;
  status: "pending" | "cleared" | "void" | "failed";
  recurring: boolean;
  recurringInterval: "daily" | "weekly" | "monthly" | "yearly";
  externalRefId: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  account: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  currency: {
    symbol: string;
    code: string;
  };
  creatorUser: {
    id: number;
    username: string;
  };
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

/** DTOs for API requests */

export interface CreateTransactionDto {
  id?: number;
  accountId: number | string | null;
  categoryId?: number;
  type: "income" | "expense";
  amount: string;
  currencyCode?: string;
  transactionDate: string; // YYYY-MM-DD
  description?: string;
  status?: "pending" | "cleared" | "void" | "failed";
  externalRefId?: string;
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
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
  categoryId?: number;
  type?: TransactionType;
  status?: "pending" | "cleared" | "void" | "failed";
  creatorUserId?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  page?: number;
  pageSize?: number;
  sortBy?:
    | "transactionDate"
    | "amount"
    | "type"
    | "status"
    | "externalRefId"
    | "id"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "ASC" | "DESC";
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
