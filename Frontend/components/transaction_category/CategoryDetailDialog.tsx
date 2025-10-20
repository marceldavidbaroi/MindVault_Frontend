"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/Category.type";

interface CategoryDialogProps {
  category?: Partial<Category>; // optional for create
  isOpen: boolean;
  onClose: () => void;
  mode: "edit" | "create";
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  mode,
}) => {
  const [editedName, setEditedName] = useState(category?.name || "");
  const [editedDisplayName, setEditedDisplayName] = useState(
    category?.displayName || ""
  );
  const [editedType, setEditedType] = useState<Category["type"]>(
    category?.type || "income"
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canEdit = !!category?.user || mode === "create";

  const handleSave = () => {
    if (mode === "create") {
      console.log("Created category:", {
        name: editedName,
        displayName: editedDisplayName,
        type: editedType,
      });
    } else {
      console.log("Saved:", {
        name: editedName,
        displayName: editedDisplayName,
        type: editedType,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (category) {
      console.log("Deleted category:", category.id);
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  return (
    <>
      {/* Main Category Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Category" : "Category Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <span className="font-medium">Name:</span>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <span className="font-medium">Display Name:</span>
              <Input
                value={editedDisplayName}
                onChange={(e) => setEditedDisplayName(e.target.value)}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <span className="font-medium">Type:</span>
              <Select
                value={editedType}
                onValueChange={(val) => setEditedType(val as Category["type"])}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 justify-end gap-2">
            {mode === "create" && (
              <Button variant="default" onClick={handleSave}>
                Create
              </Button>
            )}
            {mode === "edit" && canEdit && (
              <>
                <Button variant="default" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryDialog;
