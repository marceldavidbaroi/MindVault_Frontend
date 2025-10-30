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

export interface CreateSecurityQuestionDto {
  question: string;
  answer: string;
  password: string;
}

export interface SecurityQuestion {
  id: number;
  question: string;
  answerHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteSecurityQuestionDto {
  password: string;
}

export interface UserState {
  // ---------------- USER PROFILE ----------------
  user: User | undefined;
  setUser: (user: User) => void;

  // ---------------- PASSKEY ----------------
  passkey: string | undefined;
  setPasskey: (passkey: string) => void;
  getPasskey: (data: getPasskeyDto) => Promise<ApiResponse<any>>;

  // ---------------- SECURITY QUESTIONS ----------------
  securityQuestions: SecurityQuestion[]; // ✅ clean type
  setSecurityQuestions: (questions: SecurityQuestion[]) => void;

  getSecurityQuestion: () => Promise<ApiResponse<SecurityQuestion[]>>;
  createSecurityQuestion: (
    data: CreateSecurityQuestionDto
  ) => Promise<ApiResponse<SecurityQuestion>>;
  updateSecurityQuestion: (
    id: number,
    data: CreateSecurityQuestionDto
  ) => Promise<ApiResponse<SecurityQuestion>>;
  deleteSecurityQuestion: (
    id: number,
    data: DeleteSecurityQuestionDto
  ) => Promise<ApiResponse<void>>;

  // ---------------- PROFILE OPERATIONS ----------------
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (data: UpdateProfileDto) => Promise<ApiResponse<any>>;
  updatePreference: (data: any) => Promise<ApiResponse<any>>;
}
