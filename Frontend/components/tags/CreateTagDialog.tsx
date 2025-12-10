"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as LucideIcons from "lucide-react";
import { TAG_ICONS } from "@/constants/icons";
import { useTagStore } from "@/store/tagsStore";

const SOFT_COLORS = [
  "#FFD6A5",
  "#FFABAB",
  "#CDB4DB",
  "#B5EAEA",
  "#FFE1A8",
  "#F9F871",
  "#FFDAC1",
];

interface CreateTagDto {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  groupId?: number;
}

export function CreateTagDialog({
  open,
  onOpenChange,
  groupId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  groupId: number;
}) {
  const createTag = useTagStore((s) => s.createTag);

  const [form, setForm] = useState<CreateTagDto>({
    name: "",
    displayName: "",
    description: "",
    icon: TAG_ICONS[0],
    color: SOFT_COLORS[0],
    groupId,
  });

  const onSubmit = async () => {
    const res = await createTag(form);
    if (res.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Display Name */}
          <div>
            <Label>Display Name</Label>
            <Input
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Icon Picker */}
          <div>
            <Label>Icon</Label>
            <ScrollArea className="h-32 border rounded p-2">
              <div className="grid grid-cols-6 gap-2">
                {TAG_ICONS.map((iconName) => {
                  const IconComp = (LucideIcons as any)[iconName];
                  return (
                    <div
                      key={iconName}
                      className={`p-1 rounded cursor-pointer border hover:bg-background flex items-center justify-center ${
                        form.icon === iconName ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setForm({ ...form, icon: iconName })}
                    >
                      {IconComp && <IconComp size={20} />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Color Picker */}
          <div>
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {SOFT_COLORS.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded cursor-pointer border ${
                    form.color === color ? "border-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
