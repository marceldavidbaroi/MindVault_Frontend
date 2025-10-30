import { ApiResponse } from "./ApiResponse.type";

export interface UserPreferences {
  frontend: Record<string, any>;
  backend: Record<string, any>;
}

export interface User {
  id: number;
  email: string;
  username: string;
  passkey: string;
  passkeyExpiresAt: Date | null;
  hasSecurityQuestions: boolean;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  preferences: UserPreferences;
}

export interface UpdateProfileDto {
  email: string;
}
export interface UserState {
  user: User | undefined;
  setUser: (user: User) => void;
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (data: UpdateProfileDto) => void;
  updatePreference: (data: any) => void;
}
