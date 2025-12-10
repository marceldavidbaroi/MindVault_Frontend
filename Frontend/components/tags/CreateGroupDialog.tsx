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

interface CreateTagGroupDto {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const createTagGroup = useTagStore((s) => s.createTagGroup);

  const [form, setForm] = useState<CreateTagGroupDto>({
    name: "",
    displayName: "",
    description: "",
    icon: TAG_ICONS[0],
  });

  const onSubmit = async () => {
    const res = await createTagGroup(form);
    if (res.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
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

          {/* Icon Grid */}
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
        </div>

        <DialogFooter>
          <Button onClick={onSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
