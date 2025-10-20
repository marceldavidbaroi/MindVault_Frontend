"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field"; // new Shadcn 2.x Field

import { Category } from "@/types/Category.type";
import { useCategoryStore } from "@/store/categoryStore";
import { useNotificationStore } from "@/store/notificationStore";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayName: z.string().min(1, "Display name is required"),
  type: z.enum(["income", "expense"], { required_error: "Type is required" }),
});

interface CategoryDialogProps {
  category?: Partial<Category>;
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
  const notify = useNotificationStore((state) => state.setResponse);
  const categoryStore = useCategoryStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canEdit = !!category?.user || mode === "create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      displayName: category?.displayName || "",
      type: category?.type || "income",
    },
  });

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    if (mode === "create") {
      const res = await categoryStore.createCategory(values);
      notify(res);
      await categoryStore.getCategoryStats();
      form.reset(); // <-- Reset form to empty/default values
    } else if (mode === "edit" && category?.id) {
      const res = await categoryStore.updateCategory(category.id, values);
      notify(res);
      await categoryStore.getCategoryStats();
      // For edit mode, you might reset to updated values if you want:
      form.reset(values);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (category?.id) {
      const res = await categoryStore.deleteCategory(category.id);
      notify(res);
      await categoryStore.getCategoryStats();
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-4 mt-2"
          >
            {/* Name */}
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">Name</label>
              <Input
                placeholder="Enter name"
                disabled={!canEdit}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <span className="text-destructive text-sm mt-1">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>

            {/* Display Name */}
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">Display Name</label>
              <Input
                placeholder="Enter display name"
                disabled={!canEdit}
                {...form.register("displayName")}
              />
              {form.formState.errors.displayName && (
                <span className="text-destructive text-sm mt-1">
                  {form.formState.errors.displayName.message}
                </span>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">Type</label>
              <Select
                value={form.watch("type")}
                onValueChange={(val) => form.setValue("type", val)}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <span className="text-destructive text-sm mt-1">
                  {form.formState.errors.type.message}
                </span>
              )}
            </div>

            <DialogFooter className="mt-6 justify-end gap-2">
              {mode === "create" && (
                <Button type="submit" variant="default">
                  Create
                </Button>
              )}
              {mode === "edit" && canEdit && (
                <>
                  <Button type="submit" variant="default">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm text-muted-foreground">
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
