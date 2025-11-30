"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useSavingsGoalsStore } from "@/store/savingsGoalsStore";
import { Edit2, Trash2 } from "lucide-react";
import { SavingsGoalFormDialog } from "./SavingsGoalFormDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SavingsGoalsList() {
  const savingsGoalsStore = useSavingsGoalsStore();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCardClick = (accountId: number) => {
    router.push(`/finance/transaction/${accountId}`);
  };

  const handleEditClick = (goalId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGoalId(goalId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (goalId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGoalId(goalId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedGoalId) await savingsGoalsStore.deleteGoal(selectedGoalId);
    setIsDeleteDialogOpen(false);
    setSelectedGoalId(null);
  };

  return (
    <>
      <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoalsStore.goals?.map((goal) => {
          const account = goal.account;
          const currency = account?.currency?.symbol || "";

          const targetAmount = Number(goal.target_amount);
          const currentBalance = Number(account.balance);
          const progress =
            targetAmount > 0 ? (currentBalance / targetAmount) * 100 : 0;

          return (
            <Card
              key={goal.id}
              onClick={() => handleCardClick(account.id)}
              className="
                rounded-xl 
                backdrop-blur-md 
                bg-white/40 
                dark:bg-neutral-900/40
                border border-white/20 
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)]
                hover:scale-[1.01]
                active:scale-[0.99]
                transition-all 
                cursor-pointer
              "
            >
              <CardHeader className="pb-2 flex items-center justify-between">
                {/* Left side: goal name */}
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {goal.name}
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 rounded-md capitalize bg-black/10"
                  >
                    {goal.status}
                  </Badge>
                </CardTitle>

                {/* Right side: Edit + Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleEditClick(goal.id, e)}
                    className="p-1 rounded hover:bg-black/10 transition"
                    title="Edit Goal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(goal.id, e)}
                    className="p-1 rounded hover:bg-red-100 transition"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className=" font-medium">Target:</span>
                  <span>
                    {currency}
                    {targetAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className=" font-medium">Balance:</span>
                  <span>
                    {currency}
                    {currentBalance.toFixed(2)}
                  </span>
                </div>

                <Progress
                  value={progress}
                  className="h-1.5 rounded-full mt-1"
                />

                <div className="flex items-center justify-between">
                  <span className=" font-medium">Progress:</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className=" font-medium">Target Date:</span>
                  <span>
                    {goal.target_date
                      ? format(new Date(goal.target_date), "dd MMM yyyy")
                      : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Goal Dialog */}
      <SavingsGoalFormDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        goal={
          savingsGoalsStore.goals.find((goal) => goal.id === selectedGoalId) ||
          undefined
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this savings goal?</p>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
