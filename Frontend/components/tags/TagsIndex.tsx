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
import { MoreVertical, Recycle, Search, Trash, User, X } from "lucide-react";

import * as LucideIcons from "lucide-react";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { CreateTagDialog } from "./CreateTagDialog";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "../common/ConfirmDeleteModal";

// Convert kebab-case or snake_case to PascalCase for Lucide icons
function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

// Auto contrast
function getContrastYIQ(hexcolor: string) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export function TagsIndex() {
  const tagsStore = useTagStore();
  const { tags, tagGroups } = tagsStore;

  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    tagsStore.getAllTagGroups({ includeSystem: true });
  }, []);

  // Group tags by groupId
  const groupedTags: Record<number, typeof tags> = {};
  tags.forEach((tag) => {
    if (!groupedTags[tag.groupId!]) groupedTags[tag.groupId!] = [];
    groupedTags[tag.groupId!].push(tag);
  });

  const sortedGroups = [...tagGroups];
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroupToDelete, setSelectedGroupToDelete] = useState<
    number | null
  >(null);
  const router = useRouter();

  const handleSearchKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      console.log("Search query:", searchQuery);
      await tagsStore.getAllTags({ q: searchQuery, includeSystem: true });
      // optionally, redirect to search results page
      // router.push(`/tags/search?q=${searchQuery}`);
    }
  };

  const handleRecycleClick = () => {
    router.push("/tags/recycle");
  };

  const handleClear = async () => {
    console.log("Clearing search:", searchQuery);

    setSearchQuery("");
    await tagsStore.getAllTags({ includeSystem: true });
  };
  // Open confirm dialog
  const handleDeleteGroupClick = (groupId: number) => {
    setSelectedGroupToDelete(groupId);
    setConfirmOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (selectedGroupToDelete === null) return;

    try {
      const res = await tagsStore.deleteTagGroup(selectedGroupToDelete);
      if (res.success) {
        console.log("Group deleted");
      } else {
        console.error("Failed to delete group:", res.message);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setConfirmOpen(false);
      setSelectedGroupToDelete(null);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedGroupToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-3 w-full">
        {/* Search box */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-8 py-2 rounded-md border bg-background/60 backdrop-blur-md w-full"
          />

          {/* Search icon */}
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Recycle button */}
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

      <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <CreateGroupDialog
          open={createGroupOpen}
          onOpenChange={setCreateGroupOpen}
        />
        {selectedGroupId !== null && (
          <CreateTagDialog
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
        {/* Render each group */}
        {sortedGroups.map((group) => {
          // Resolve group icon
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
                          onClick={() =>
                            console.log("Edit group:", group.displayName)
                          }
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
              {/* Tags */}
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
      <ConfirmDeleteModal
        open={confirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this tag group?"
      />
    </div>
  );
}
