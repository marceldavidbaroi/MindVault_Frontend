import { ApiResponse } from "./ApiResponse.type";

export interface UserPreferences {
  frontend: Record<string, any>;
  backend: Record<string, any>;
}

export interface User {
  id: number;
  email: string;
  username: string;
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
export interface getPasskeyDto {
  password: string;
}
export interface UserState {
  user: User | undefined;
  passkey: string | undefined;
  setUser: (user: User) => void;
  setPasskey: (passkey: string) => void;
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (data: UpdateProfileDto) => Promise<ApiResponse<any>>;
  updatePreference: (data: any) => Promise<ApiResponse<any>>;
  getPasskey: (data: getPasskeyDto) => Promise<ApiResponse<any>>;
}
