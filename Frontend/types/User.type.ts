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

export interface resetPasswordPasskeyDto {
  username: string;
  passkey: string;
  newPassword: string;
}

export interface changePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyAnswerDto {
  username: string;
  answers: {
    questionId: number;
    answer: string;
  }[];
  newPassword: string;
}

export interface UserState {
  // ---------------- USER PROFILE ----------------
  user: User | undefined;
  initialized: boolean; // ✅ track if profile is already loaded
  setUser: (user: User) => void;

  // ---------------- PASSKEY ----------------
  passkey: string | undefined;
  setPasskey: (passkey: string) => void;
  getPasskey: (data: getPasskeyDto) => Promise<ApiResponse<any>>;

  // ---------------- SECURITY QUESTIONS ----------------
  securityQuestions: SecurityQuestion[];
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
  getProfile: () => Promise<ApiResponse<any>>;
  updateProfile: (data: UpdateProfileDto) => Promise<ApiResponse<any>>;
  updatePreference: (data: any) => Promise<ApiResponse<any>>;
  resetPasswordPasskey: (data: resetPasswordPasskeyDto) => Promise<any>;
  forgetPassQuestions: (query: string) => Promise<any>;
  verifyAnswer: (data: VerifyAnswerDto) => Promise<any>;
  changePassword: (data: changePasswordDto) => Promise<any>;
}
