"use client";

import { useEffect, useState } from "react";
import { useTagStore } from "@/store/tagsStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Recycle, Search, User, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { GroupFormDialog } from "./GroupFormDialog";
import { TagFormDialog } from "./TagFormDialog";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "../common/ConfirmDeleteModal";
import { TagDetailsDialog } from "./TagDetailsDialog";
import { getContrastYIQ, toPascalCase } from "@/lib/utils";

export function TagsIndex() {
  const tagsStore = useTagStore();
  const { tags, tagGroups } = tagsStore;
  const router = useRouter();

  // ✅ UI state
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [confirmGroupDeleteOpen, setConfirmGroupDeleteOpen] = useState(false);
  const [selectedGroupToDelete, setSelectedGroupToDelete] = useState<
    number | null
  >(null);

  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [selectedTagEdit, setSelectedTagEdit] = useState<any>(null);
  const [showTagDetails, setShowTagDetails] = useState(false);
  const [showEditTagDialog, setShowEditTagDialog] = useState(false);

  const [confirmTagDeleteOpen, setConfirmTagDeleteOpen] = useState(false);
  const [selectedTagToDelete, setSelectedTagToDelete] = useState<any>(null);

  // ✅ Fetch data
  useEffect(() => {
    tagsStore.getAllTagGroups({ includeSystem: true });
  }, []);

  // ✅ Group tags by groupId
  const groupedTags: Record<number, typeof tags> = {};
  tags.forEach((tag) => {
    if (!groupedTags[tag.groupId!]) groupedTags[tag.groupId!] = [];
    groupedTags[tag.groupId!].push(tag);
  });

  const sortedGroups = [...tagGroups];

  // -----------------------------
  // 🟢 Handlers
  // -----------------------------
  const handleSearchKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await tagsStore.getAllTags({ q: searchQuery, includeSystem: true });
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    await tagsStore.getAllTags({ includeSystem: true });
  };

  const handleRecycleClick = () => router.push("/tags/recycle");

  // ✅ Group deletion
  const handleDeleteGroupClick = (groupId: number) => {
    setSelectedGroupToDelete(groupId);
    setConfirmGroupDeleteOpen(true);
  };
  const handleConfirmDeleteGroup = async () => {
    if (selectedGroupToDelete === null) return;
    const res = await tagsStore.deleteTagGroup(selectedGroupToDelete);
    if (!res.success) console.error(res.message);
    setConfirmGroupDeleteOpen(false);
    setSelectedGroupToDelete(null);
  };
  const handleCancelDeleteGroup = () => {
    setConfirmGroupDeleteOpen(false);
    setSelectedGroupToDelete(null);
  };

  // ✅ Group edit
  const handleEditGroup = async (id: number) => {
    const { data } = await tagsStore.getTagGroup(id);
    setSelectedGroup({
      id: data.id,
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      icon: data.icon,
    });
    setShowEditGroupDialog(true);
  };

  // ✅ Tag click / details
  const handleTagClick = async (tagId: number) => {
    const res = await tagsStore.getTag(tagId);
    if (res.success) setSelectedTag(res.data), setShowTagDetails(true);
  };

  // ✅ Tag edit
  const handleEditTag = () => {
    setSelectedTagEdit({
      id: selectedTag.id,
      name: selectedTag.name,
      displayName: selectedTag.displayName,
      description: selectedTag.description,
      icon: selectedTag.icon,
      color: selectedTag.color,
      groupId: selectedTag.group.id,
    });
    setShowEditTagDialog(true);
    setShowTagDetails(false);
  };

  // ✅ Tag deletion
  const handleDeleteTagClick = (tag: any) => {
    setSelectedTagToDelete(tag);
    setConfirmTagDeleteOpen(true);
  };
  const handleConfirmDeleteTag = async () => {
    if (!selectedTagToDelete) return;
    const res = await tagsStore.deleteTag(selectedTagToDelete.id);
    if (!res.success) console.error(res.message);
    setSelectedTagToDelete(null);
    setConfirmTagDeleteOpen(false);
    setShowTagDetails(false);
  };
  const handleCancelDeleteTag = () => {
    setSelectedTagToDelete(null);
    setConfirmTagDeleteOpen(false);
  };

  // -----------------------------
  // 🟢 Render
  // -----------------------------
  return (
    <div>
      {/* Search & Recycle */}
      <div className="flex items-center justify-end gap-3 w-full">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-8 py-2 rounded-md border bg-background/60 backdrop-blur-md w-full"
          />
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleRecycleClick}
          className="p-1 rounded hover:bg-background/70 transition"
        >
          <Recycle
            size={22}
            className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
          />
        </button>
      </div>

      {/* Groups & Tags */}
      <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <GroupFormDialog
          open={createGroupOpen}
          onOpenChange={setCreateGroupOpen}
        />
        {selectedGroupId !== null && (
          <TagFormDialog
            open={createTagOpen}
            onOpenChange={setCreateTagOpen}
            groupId={selectedGroupId}
          />
        )}

        {/* Add Group Card */}
        <Card
          className="flex items-center justify-center h-48 cursor-pointer bg-background/60 backdrop-blur-md shadow hover:scale-105 transition"
          onClick={() => setCreateGroupOpen(true)}
        >
          <CardContent className="text-center text-chart-1">
            <h2 className="text-xl font-semibold">+ Add Group</h2>
          </CardContent>
        </Card>

        {/* Render Groups */}
        {sortedGroups.map((group) => {
          const iconNamePascal = group.icon ? toPascalCase(group.icon) : "";
          const GroupIcon =
            iconNamePascal &&
            LucideIcons[iconNamePascal as keyof typeof LucideIcons]
              ? (LucideIcons[iconNamePascal as keyof typeof LucideIcons] as any)
              : null;

          return (
            <Card
              key={group.id}
              className="flex flex-col bg-background/60 backdrop-blur-md shadow hover:scale-105 transition"
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-chart-1 flex items-center gap-2">
                  {GroupIcon && <GroupIcon size={18} />}
                  {group.displayName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setCreateTagOpen(true);
                    }}
                  >
                    +
                  </Button>
                  {!group.isSystem && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleEditGroup(group.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteGroupClick(group.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2 mt-2">
                {(groupedTags[group.id] || []).map((tag) => {
                  const textColor = getContrastYIQ(tag.color!);
                  const iconNamePascal = tag.icon ? toPascalCase(tag.icon) : "";
                  const IconComponent =
                    iconNamePascal &&
                    LucideIcons[iconNamePascal as keyof typeof LucideIcons]
                      ? (LucideIcons[
                          iconNamePascal as keyof typeof LucideIcons
                        ] as any)
                      : null;

                  return (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-105 transition-transform flex items-center gap-1"
                      style={{ backgroundColor: tag.color!, color: textColor }}
                      onClick={() => handleTagClick(tag.id)}
                    >
                      {IconComponent && <IconComponent size={16} />}
                      {tag.displayName}
                      {!tag.isSystem && (
                        <User size={12} className="text-gray-400 ml-1" />
                      )}
                    </span>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      <ConfirmDeleteModal
        open={confirmGroupDeleteOpen}
        onClose={handleCancelDeleteGroup}
        onConfirm={handleConfirmDeleteGroup}
        title="Delete Group"
        description="Are you sure you want to delete this tag group?"
      />

      <GroupFormDialog
        open={showEditGroupDialog}
        onOpenChange={setShowEditGroupDialog}
        initialData={selectedGroup}
      />

      <TagDetailsDialog
        open={showTagDetails}
        onOpenChange={setShowTagDetails}
        initialData={selectedTag}
        onEdit={handleEditTag}
        onDelete={() => handleDeleteTagClick(selectedTag)}
      />

      <TagFormDialog
        open={showEditTagDialog}
        onOpenChange={setShowEditTagDialog}
        groupId={selectedTagEdit?.group?.id}
        initialData={selectedTagEdit}
      />

      <ConfirmDeleteModal
        open={confirmTagDeleteOpen}
        onClose={handleCancelDeleteTag}
        onConfirm={handleConfirmDeleteTag}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${selectedTagToDelete?.displayName}"?`}
      />
    </div>
  );
}
