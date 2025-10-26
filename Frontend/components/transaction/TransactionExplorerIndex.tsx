"use client";

import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useTransactionStore } from "@/store/transactionStore";
import { FindTransactionsDto, TransactionType } from "@/types/Transaction.type";
import TransactionExplorerList from "./TransactionExplorerList";
import TransactionExplorerListSkeleton from "./skeleton/TransactionExplorerListSkeleton";
import { PlusCircle, Layers } from "lucide-react";
import { Button } from "../ui/button";
import TransactionModal from "./TransactionModal";
import BulkTransactionModal from "./BulkTransactionModal";
import { Category } from "@/types/Category.type";
import PaginationControl from "../common/PaginationControl";
interface TransactionExplorerIndexProps {
  categories: Category[];
}

const TransactionExplorerIndex: React.FC<TransactionExplorerIndexProps> = ({
  categories,
}) => {
  const categoryStore = useCategoryStore();
  const transactionStore = useTransactionStore();

  // State
  const [type, setType] = useState<TransactionType | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isBulkIncomeModalOpen, setIsBulkIncomeModalOpen] = useState(false);
  const [isBulkExpenseModalOpen, setIsBulkExpenseModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories
  useEffect(() => {
    categoryStore.setCategories(categories);
  }, [categories]);

  // Total pages from meta
  const totalPages = transactionStore.meta
    ? Math.ceil(transactionStore.meta.total / transactionStore.meta.limit)
    : 1;

  // Fetch transactions
  const getAll = async (page = 1) => {
    setLoading(true);
    const query: FindTransactionsDto = {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      page,
    };
    if (type) query.type = type;
    if (categoryId) query.categoryId = categoryId;

    await transactionStore.getAllTransactions(query);
    setLoading(false);
  };

  useEffect(() => {
    getAll(currentPage);
  }, [type, categoryId, startDate, endDate, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Filter categories by type
  const filteredCategories = !type
    ? categoryStore.categories
    : categoryStore.categories.filter((cat) => cat.type === type);

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Filter Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <Label>Type</Label>
          <Select
            value={type || "all"}
            onValueChange={(val) =>
              setType(val === "all" ? null : (val as TransactionType))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <Label>Category</Label>
          <Select
            value={categoryId ? String(categoryId) : "all"}
            onValueChange={(val) =>
              setCategoryId(val === "all" ? null : Number(val))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <Label>Start Date</Label>
          <DatePicker
            selected={startDate}
            onSelect={(date) => date && setStartDate(date)}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <Label>End Date</Label>
          <DatePicker
            selected={endDate}
            onSelect={(date) => date && setEndDate(date)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Transaction
        </Button>

        <Button
          variant="secondary"
          onClick={() => setIsBulkIncomeModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          Add Bulk Income
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsBulkExpenseModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          Add Bulk Expense
        </Button>
      </div>

      {/* Transaction List */}
      {loading ? (
        <TransactionExplorerListSkeleton />
      ) : (
        <TransactionExplorerList transactions={transactionStore.transactions} />
      )}

      {/* Pagination */}
      {transactionStore.meta && totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <TransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <BulkTransactionModal
        open={isBulkIncomeModalOpen}
        onClose={() => setIsBulkIncomeModalOpen(false)}
        type="income"
      />
      <BulkTransactionModal
        open={isBulkExpenseModalOpen}
        onClose={() => setIsBulkExpenseModalOpen(false)}
        type="expense"
      />
    </div>
  );
};

export default TransactionExplorerIndex;
