"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";
import { toPascalCase } from "@/lib/utils"; // optional helper

interface TagDetailsDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: any | null; // tag object
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TagDetailsDialog({
  open,
  onOpenChange,
  initialData,
  onEdit,
  onDelete,
}: TagDetailsDialogProps) {
  if (!initialData) return null;

  const {
    name,
    displayName,
    description,
    icon,
    color,
    group,
    createdAt,
    isSystem,
  } = initialData;

  const iconNamePascal = icon ? toPascalCase(icon) : "";
  const IconComp =
    iconNamePascal && (LucideIcons as any)[iconNamePascal]
      ? (LucideIcons as any)[iconNamePascal]
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {IconComp && <IconComp size={20} />}
            {displayName}
          </DialogTitle>

          {!isSystem && (
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="default" onClick={onEdit}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </div>
          )}
        </DialogHeader>

        <Separator className="my-3" />

        {/* Body */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Display Name</p>
            <p className="font-medium">{displayName}</p>
          </div>

          {description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Group</p>
            <p className="font-medium">{group?.displayName}</p>
          </div>

          {/* Color Preview */}
          <div>
            <p className="text-sm text-muted-foreground">Color</p>
            <div
              className="w-10 h-4 rounded mt-1 border"
              style={{ backgroundColor: color }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1">{color}</p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-sm">{new Date(createdAt).toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
