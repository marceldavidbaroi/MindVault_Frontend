// ==================== TAG GROUPS ====================
export interface TagGroup {
  id: number;
  name: string;
  displayName: string;
  description?: string | null;
  icon?: string | null;
  isSystem: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagGroupDto {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}

export interface QueryTagGroupDto {
  q?: string;
  includeSystem?: boolean;
  onlyDeleted?: boolean;
  includeDeleted?: boolean;
  limit?: number;
  page?: number;
}

// ==================== TAGS ====================
export interface Tag {
  id: number;
  name: string;
  displayName: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  groupId?: number | null;
  group?: Partial<TagGroup> | null; // include only id, name, displayName
  isSystem: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  groupId?: number;
}

export interface QueryTagDto {
  q?: string;
  groupId?: number;
  includeSystem?: boolean;
  includeDeleted?: boolean;
  limit?: number;
  page?: number;
  includeGroup?: boolean;
}

// ==================== STORE STATE ====================
export interface TagState {
  // Tag Groups
  tagGroups: TagGroup[];
  setTagGroups: (groups: TagGroup[]) => void;
  getAllTagGroups: (params?: QueryTagGroupDto) => Promise<any>;
  getTagGroup: (id: number) => Promise<any>;
  createTagGroup: (data: CreateTagGroupDto) => Promise<any>;
  updateTagGroup: (
    id: number,
    data: Partial<CreateTagGroupDto>
  ) => Promise<any>;
  deleteTagGroup: (id: number) => Promise<any>;
  restoreTagGroup: (id: number) => Promise<any>;
  forceDeleteTagGroup: (id: number) => Promise<any>;

  // Tags
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  getAllTags: (params?: QueryTagDto) => Promise<any>;
  getTag: (id: number) => Promise<any>;
  createTag: (data: CreateTagDto) => Promise<any>;
  updateTag: (id: number, data: Partial<CreateTagDto>) => Promise<any>;
  deleteTag: (id: number) => Promise<any>;
  restoreTag: (id: number) => Promise<any>;
  forceDeleteTag: (id: number) => Promise<any>;
}
