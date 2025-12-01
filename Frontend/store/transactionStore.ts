import { create } from "zustand";
import { transactionService } from "@/services/transactionService";
import {
  Transaction,
  TransactionMeta,
  CreateTransactionDto,
  FindTransactionsDto,
  ApiResponse,
  BulkCreateTransaction,
  Statement, // <-- add if you have a Statement type
} from "@/types/Transaction.type";

const today = new Date().toISOString().split("T")[0];

interface TransactionState {
  transactions: Transaction[] | [];
  meta: TransactionMeta | null;

  /** Statements */
  statements: Statement | null;
  setStatements: (statements: Statement) => void;
  getStatements: (
    accountId: number,
    params: { from: string; to: string }
  ) => Promise<ApiResponse<Statement>>;

  /** Filter state */
  filters: FindTransactionsDto;
  setFilters: (filters: Partial<FindTransactionsDto>) => void;

  /** State updaters */
  setTransactions: (
    transactions: Transaction[],
    meta?: TransactionMeta
  ) => void;

  /** Fetch all transactions */
  getAllTransactions: (
    accountId: number,
    params?: FindTransactionsDto
  ) => Promise<void>;

  /** Fetch a single transaction */
  getTransaction: (id: number) => Promise<Transaction | null>;

  /** Create a new transaction */
  createTransaction: (
    data: CreateTransactionDto
  ) => Promise<Transaction | null>;

  /** Update a transaction */
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
  transactions: [],
  meta: { page: 1, pageSize: 25, total: 0 },

  /** ---------------------- STATEMENTS ---------------------- */
  statements: null,
  setStatements: (statements) => set({ statements }),

  getStatements: async (accountId, params) => {
    try {
      const res: ApiResponse<Statement> =
        await transactionService.getStatements(accountId, params);

      if (res.success) {
        set({ statements: res.data });
      }

      return res;
    } catch (error) {
      console.error("Failed to fetch statements:", error);

      return {
        success: false,
        message: "Failed to fetch statements",
        data: {
          openingBalance: "0.00",
          transactions: [],
          closingBalance: "0.00",
        }, // ← satisfies ApiResponse<Statement>
      };
    }
  },

  /** ---------------------- FILTERS ---------------------- */
  filters: {
    page: 1,
    pageSize: 25,
    sortBy: "updatedAt",
    sortOrder: "DESC",
    to: today,
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  /** ---------------------- TRANSACTIONS ---------------------- */

  setTransactions: (transactions, meta) =>
    set({ transactions, meta: meta || null }),

  getAllTransactions: async (accountId, params) => {
    try {
      const res: ApiResponse<Transaction[]> = await transactionService.getAll(
        accountId,
        params
      );

      if (res.success) {
        set({
          transactions: res.data,
          meta: res.meta ?? { page: 1, pageSize: 25, total: 0 },
        });
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
