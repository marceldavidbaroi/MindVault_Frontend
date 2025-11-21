import { create } from "zustand";
import { transactionService } from "@/services/transactionService";
import {
  Transaction,
  TransactionMeta,
  CreateTransactionDto,
  FindTransactionsDto,
  ApiResponse,
  PaginatedTransactions,
  BulkCreateTransaction,
} from "@/types/Transaction.type";

interface TransactionState {
  transactions: PaginatedTransactions | null;
  meta: TransactionMeta | null;

  /** State updaters */
  setTransactions: (
    transactions: PaginatedTransactions,
    meta?: TransactionMeta
  ) => void;

  /** Fetch all transactions */
  getAllTransactions: (
    accountId: number,
    params?: FindTransactionsDto
  ) => Promise<void>;

  /** Fetch a single transaction by ID */
  getTransaction: (id: number) => Promise<Transaction | null>;

  /** Create a new transaction */
  createTransaction: (
    data: CreateTransactionDto
  ) => Promise<Transaction | null>;

  /** Update an existing transaction */
  updateTransaction: (
    id: number,
    data: Partial<CreateTransactionDto>
  ) => Promise<Transaction | null>;

  /** Delete a transaction */
  deleteTransaction: (id: number) => Promise<boolean>;

  /** Bulk create transactions */
  createBulkTransactions: (
    data: BulkCreateTransaction
  ) => Promise<Transaction[] | null>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: null,
  meta: null,

  setTransactions: (transactions, meta) =>
    set({ transactions, meta: meta || null }),

  getAllTransactions: async (accountId, params) => {
    try {
      const res: ApiResponse<PaginatedTransactions> =
        await transactionService.getAll(accountId, params);

      if (res.success) {
        set({ transactions: res.data, meta: res.meta ?? null });
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  },

  getTransaction: async (id) => {
    try {
      const res: ApiResponse<Transaction> = await transactionService.getOne(id);
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      return null;
    }
  },

  createTransaction: async (data) => {
    try {
      const res: ApiResponse<Transaction> = await transactionService.create(
        data
      );
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      return null;
    }
  },

  updateTransaction: async (id, data) => {
    try {
      const res: ApiResponse<Transaction> = await transactionService.update(
        id,
        data
      );
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to update transaction:", error);
      return null;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res: ApiResponse<null> = await transactionService.remove(id);
      return res.success;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      return false;
    }
  },

  createBulkTransactions: async (data) => {
    try {
      const res: ApiResponse<Transaction[]> =
        await transactionService.createBulk(data);
      return res.success ? res.data : null;
    } catch (error) {
      console.error("Failed to bulk create transactions:", error);
      return null;
    }
  },
}));
