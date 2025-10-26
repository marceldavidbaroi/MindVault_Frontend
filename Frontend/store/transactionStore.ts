// store/transactionStore.ts
import { create } from "zustand";
import { transactionService } from "@/services/transactionService";
import {
  Transaction,
  TransactionMeta,
  CreateTransactionDto,
  BulkTransactionDto,
  FindTransactionsDto,
  ApiResponse,
} from "@/types/Transaction.type";

interface TransactionState {
  transactions: Transaction[];
  meta: TransactionMeta | null;

  /** State updaters */
  setTransactions: (
    transactions: Transaction[],
    meta?: TransactionMeta
  ) => void;

  /** Fetch all transactions */
  getAllTransactions: (params?: FindTransactionsDto) => Promise<void>;

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
    data: BulkTransactionDto
  ) => Promise<Transaction[] | null>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  meta: null,

  setTransactions: (transactions, meta) =>
    set({ transactions, meta: meta || null }),

  getAllTransactions: async (params) => {
    try {
      const res: ApiResponse<Transaction[]> = await transactionService.getAll(
        params
      );
      console.log("response", res);

      if (res.success) {
        const meta = res.meta ?? (res as any)?.data?.meta ?? null;
        set({ transactions: res.data, meta });
        console.log(meta);
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
      if (res.success) {
        set({ transactions: [res.data, ...get().transactions] });
        return res.data;
      }
      return null;
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
      if (res.success) {
        set({
          transactions: get().transactions.map((t) =>
            t.id === id ? res.data : t
          ),
        });
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to update transaction:", error);
      return null;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res: ApiResponse<null> = await transactionService.remove(id);
      if (res.success) {
        set({ transactions: get().transactions.filter((t) => t.id !== id) });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      return false;
    }
  },

  createBulkTransactions: async (data) => {
    try {
      const res: ApiResponse<Transaction[]> =
        await transactionService.createBulk(data);
      if (res.success) {
        set({ transactions: [...res.data, ...get().transactions] });
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to bulk create transactions:", error);
      return null;
    }
  },
}));
