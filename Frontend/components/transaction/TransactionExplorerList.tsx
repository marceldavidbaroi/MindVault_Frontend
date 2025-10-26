"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Edit, Trash2, Save, X } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { Transaction } from "@/types/Transaction.type";
import { Category } from "@/types/Category.type";
import { DatePicker } from "../ui/date-picker";
import { ConfirmDeleteModal } from "../common/ConfirmDeleteModal";

interface TransactionExplorerListProps {
  transactions: Transaction[];
}

const TransactionExplorerList: React.FC<TransactionExplorerListProps> = ({
  transactions,
}) => {
  const categoryStore = useCategoryStore();
  const transactionStore = useTransactionStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  // Update filtered categories whenever editData.type changes
  useEffect(() => {
    if (editData.type) {
      setFilteredCategories(
        categoryStore.categories.filter((c) => c.type === editData.type)
      );
    } else {
      setFilteredCategories(categoryStore.categories);
    }
  }, [editData.type, categoryStore.categories]);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };
  const handleSave = async () => {
    const payload = {
      categoryId: editData.category?.id,
      amount: Number(editData.amount) ?? 0,
      date: editData.date,
      description: editData.description ?? "",
      recurring:
        editData.recurring !== undefined ? editData.recurring : undefined,
      recurringInterval: editData.recurringInterval ?? undefined, // ✅ converts null → undefined
      type: editData.type,
    };

    console.log(payload);
    await transactionStore.updateTransaction(editData.id!, payload);
    setEditingId(null);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
    console.log("Delete transaction:", transaction);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      transactionStore.deleteTransaction(selectedTransaction.id);
    }
  };

  // Inside your component
  const handleChange = (field: keyof Transaction, value: any) => {
    // If type changes, automatically set the first matching category
    if (field === "type") {
      const matchingCategories = categoryStore.categories.filter(
        (c) => c.type === value
      );
      setEditData((prev) => ({
        ...prev,
        type: value,
        category: matchingCategories[0] || null,
      }));
    } else {
      setEditData((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="w-full">
        <div className="p-4 text-center text-muted-foreground text-sm">
          No transactions found.
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
              <th className="px-4 py-2 text-center font-medium">Type</th>
              <th className="px-4 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, index) => {
              const isEditing = editingId === t.id;

              return (
                <tr
                  key={t.id}
                  className={`border-t hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  } ${
                    isEditing ? "border-l-4 border-primary bg-muted/20" : ""
                  }`}
                >
                  {/* Date */}
                  {/* Date */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <DatePicker
                        selected={
                          editData.date ? new Date(editData.date) : undefined
                        }
                        onSelect={(date) =>
                          handleChange(
                            "date",
                            date.toISOString().split("T")[0] // store as "YYYY-MM-DD"
                          )
                        }
                        placeholder="Select date"
                        inputClassName="h-7 text-sm"
                      />
                    ) : (
                      t.date
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <Select
                        value={editData.category?.id?.toString() || ""}
                        onValueChange={(value) => {
                          const selected = filteredCategories.find(
                            (c) => c.id.toString() === value
                          );
                          handleChange("category", selected || null);
                        }}
                      >
                        <SelectTrigger className="h-7 w-[140px] text-xs">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      t.category?.displayName || "Uncategorized"
                    )}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-2 truncate max-w-[300px]">
                    {isEditing ? (
                      <Input
                        value={editData.description || ""}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        className="h-7"
                      />
                    ) : (
                      t.description || "—"
                    )}
                  </td>

                  {/* Amount */}
                  <td
                    className={`px-4 py-2 text-right font-semibold ${
                      t.type === "expense"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.amount || ""}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        className="h-7 text-right"
                      />
                    ) : (
                      `৳ ${parseFloat(t.amount).toLocaleString()}`
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-2 text-center">
                    {isEditing ? (
                      <Select
                        value={editData.type || ""}
                        onValueChange={(value) => handleChange("type", value)}
                      >
                        <SelectTrigger className="h-7 w-[110px] text-xs capitalize">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={
                          t.type === "income" ? "outline" : "destructive"
                        }
                        className="capitalize text-xs"
                      >
                        {t.type}
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 px-2 text-xs"
                            onClick={handleSave}
                          >
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={handleCancel}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleEdit(t)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleDelete(t)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};

export default TransactionExplorerList;
