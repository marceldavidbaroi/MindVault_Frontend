// store/tagStore.ts
import { create } from "zustand";
import { tagService } from "@/services/tagsServices";
import {
  Tag,
  TagGroup,
  TagState,
  CreateTagDto,
  CreateTagGroupDto,
  QueryTagDto,
  QueryTagGroupDto,
} from "@/types/Tags.types";

export const useTagStore = create<TagState>((set, get) => ({
  // ==================== TAG GROUPS ====================
  tagGroups: [],
  setTagGroups: (groups: TagGroup[]) => set({ tagGroups: groups }),

  getAllTagGroups: async (params?: QueryTagGroupDto) => {
    const res = await tagService.getAllGroups(params);
    if (res.success && res.data) set({ tagGroups: res.data });
    return res;
  },

  getTagGroup: async (id: number) => {
    const res = await tagService.getGroup(id);
    return res;
  },

  createTagGroup: async (data: CreateTagGroupDto) => {
    const res = await tagService.createGroup(data);
    if (res.success && res.data) {
      set({ tagGroups: [res.data, ...(get().tagGroups || [])] });
    }
    return res;
  },

  updateTagGroup: async (id: number, data: Partial<CreateTagGroupDto>) => {
    const res = await tagService.updateGroup(id, data);
    if (res.success && res.data) {
      set({
        tagGroups: (get().tagGroups || []).map((g) =>
          g.id === id ? res.data! : g
        ),
      });
    }
    return res;
  },

  deleteTagGroup: async (id: number) => {
    const res = await tagService.deleteGroup(id);
    if (res.success) {
      set({ tagGroups: (get().tagGroups || []).filter((g) => g.id !== id) });
    }
    return res;
  },

  restoreTagGroup: async (id: number) => {
    const res = await tagService.restoreGroup(id);
    if (res.success) {
      await get().getAllTagGroups();
    }
    return res;
  },

  forceDeleteTagGroup: async (id: number) => {
    const res = await tagService.forceDeleteGroup(id);
    if (res.success) {
      set({ tagGroups: (get().tagGroups || []).filter((g) => g.id !== id) });
    }
    return res;
  },

  // ==================== TAGS ====================
  tags: [],
  setTags: (tags: Tag[]) => set({ tags }),

  getAllTags: async (params?: QueryTagDto) => {
    const res = await tagService.getAllTags(params);
    if (res.success && res.data) set({ tags: res.data });
    return res;
  },

  getTag: async (id: number) => {
    const res = await tagService.getTag(id);
    return res;
  },

  createTag: async (data: CreateTagDto) => {
    const res = await tagService.createTag(data);
    if (res.success && res.data) {
      set({ tags: [res.data, ...(get().tags || [])] });
    }
    return res;
  },

  updateTag: async (id: number, data: Partial<CreateTagDto>) => {
    const res = await tagService.updateTag(id, data);
    if (res.success && res.data) {
      set({
        tags: (get().tags || []).map((t) => (t.id === id ? res.data! : t)),
      });
    }
    return res;
  },

  deleteTag: async (id: number) => {
    const res = await tagService.deleteTag(id);
    if (res.success) {
      set({ tags: (get().tags || []).filter((t) => t.id !== id) });
    }
    return res;
  },

  restoreTag: async (id: number) => {
    const res = await tagService.restoreTag(id);
    if (res.success) {
      await get().getAllTags();
    }
    return res;
  },

  forceDeleteTag: async (id: number) => {
    const res = await tagService.forceDeleteTag(id);
    if (res.success) {
      set({ tags: (get().tags || []).filter((t) => t.id !== id) });
    }
    return res;
  },
}));
