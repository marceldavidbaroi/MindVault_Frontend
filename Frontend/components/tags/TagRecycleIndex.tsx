"use client";

import { useEffect, useState } from "react";
import { useTagStore } from "@/store/tagsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, RotateCw, ArrowLeft } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { getContrastYIQ } from "@/lib/utils";

const TagRecycleIndex = () => {
  const tagStore = useTagStore();
  const router = useRouter();

  const [deletedGroups, setDeletedGroups] = useState<any[]>([]);
  const [deletedTags, setDeletedTags] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItemType, setSelectedItemType] = useState<"tag" | "group">(
    "tag"
  );

  useEffect(() => {
    const fetchDeleted = async () => {
      const groups = await tagStore.getAllTagGroups({ onlyDeleted: true });
      const tags = await tagStore.getAllTags({ onlyDeleted: true });
      setDeletedGroups(groups.data || []);
      setDeletedTags(tags.data || []);
    };
    fetchDeleted();
  }, []);

  // Group deleted tags by groupId for display
  const groupedDeletedTags: Record<number, any[]> = {};
  deletedTags.forEach((tag) => {
    if (!groupedDeletedTags[tag.groupId!])
      groupedDeletedTags[tag.groupId!] = [];
    groupedDeletedTags[tag.groupId!].push(tag);
  });

  const handleRestore = async (item: any, type: "tag" | "group") => {
    if (type === "tag") {
      await tagStore.restoreTag(item.id);
      setDeletedTags(deletedTags.filter((t) => t.id !== item.id));
    } else {
      await tagStore.restoreTagGroup(item.id);
      setDeletedGroups(deletedGroups.filter((g) => g.id !== item.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    if (selectedItemType === "tag") {
      await tagStore.forceDeleteTag(selectedItem.id);
      setDeletedTags(deletedTags.filter((t) => t.id !== selectedItem.id));
    } else {
      await tagStore.forceDeleteTagGroup(selectedItem.id);
      setDeletedGroups(deletedGroups.filter((g) => g.id !== selectedItem.id));
    }

    setSelectedItem(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-6 space-y-10">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.push("/tags")}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft size={16} /> Back to Tags
      </Button>

      {/* Deleted Groups */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Deleted Groups</h2>
        {deletedGroups.length === 0 ? (
          <p className="text-muted-foreground">No deleted groups found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {deletedGroups.map((group) => (
              <Card
                key={group.id}
                className="flex flex-col bg-white/30 backdrop-blur-md shadow-md border border-white/20"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    {group.displayName}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(group, "group")}
                    >
                      <RotateCw size={16} /> Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedItem(group);
                        setSelectedItemType("group");
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Deleted Tags */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Deleted Tags</h2>
        {deletedTags.length === 0 ? (
          <p className="text-muted-foreground">No deleted tags found.</p>
        ) : (
          Object.keys(groupedDeletedTags).map((groupId) => {
            const tagsInGroup = groupedDeletedTags[Number(groupId)];
            return (
              <div key={groupId} className="mb-6">
                <h3 className="font-semibold mb-2">
                  Group:{" "}
                  {deletedGroups.find((g) => g.id === Number(groupId))
                    ?.displayName || `Group ID ${groupId}`}
                </h3>
                {tagsInGroup.length === 0 ? (
                  <p className="text-muted-foreground">
                    No deleted tags in this group.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tagsInGroup.map((tag) => (
                      <div
                        key={tag.id}
                        className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-white/30 backdrop-blur-md"
                        style={{
                          backgroundColor: tag.color,
                          color: getContrastYIQ(tag.color),
                        }}
                      >
                        <span>{tag.displayName}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(tag, "tag")}
                        >
                          <RotateCw size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedItem(tag);
                            setSelectedItemType("tag");
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${selectedItemType === "tag" ? "Tag" : "Group"}`}
        description={`Are you sure you want to permanently delete "${selectedItem?.displayName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TagRecycleIndex;
