// types/Account.type.ts

import { Currency } from "./Currency.type";

/** Account Type entity */
export interface AccountType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  scope: "personal" | "business" | "family" | "shared"; // as per your data
}

/** Account entity */

export interface Account {
  id: number;
  name: string;
  description?: string;
  balance: string; // API returns balance as string
  type: AccountType;
  currencyCode?: Partial<Currency> | null;
}
export interface AccessAccount {
  id: number;
  account: {
    id: number;
    name: string;
    description: string;
    initialBalance: string;
    balance: string;
    ownerId: number;
  };
  role: {
    id: number;
    name: string;
    displayName: string;
    description: string;
  };
}

/** DTO for creating an account */
export interface CreateAccountDto {
  name: string;
  description?: string;
  initialBalance: number;
  accountTypeId: number;
  currencyCode: string;
}

/** DTO for updating an account */
export interface UpdateAccountDto {
  name?: string;
  description?: string;
  accountTypeId?: number;
  currencyCode?: string;
}

/** User assigned to an account */
export interface AccountUser {
  id: number;
  username: string;
  email?: string | null;
  isActive: boolean;
}

/** Role entity */
export interface Role {
  id: number;
  name: string;
  displayName: string;
  description?: string;
}

/** Account Role mapping */
export interface AccountRole {
  id: number;
  user: AccountUser;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

/** DTO for assigning/updating a user role for an account */
export interface UpdateRoleDto {
  roleId: number; // role name or role ID depending on backend implementation
}

export interface AssignRoleDto {
  username: string;
  roleId: number;
}

/** Filters for fetching accounts */
export interface FilterAccountsDto {
  search?: string;
  typeId?: number;
  page?: number;
  limit?: number;
}
