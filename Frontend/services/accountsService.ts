import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import {
  Account,
  AccountType,
  CreateAccountDto,
  UpdateAccountDto,
  AssignRoleDto,
  UpdateRoleDto,
  AccessAccount,
} from "@/types/Account.type";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const accountService = {
  /** CREATE a new account */
  create: (data: CreateAccountDto) =>
    fetcher<ApiResponse<Account>>(ENDPOINTS.accounts.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** GET all accounts for current user */
  getMy: () =>
    fetcher<ApiResponse<Account[]>>(ENDPOINTS.accounts.my, {
      method: "GET",
    }),

  /** GET accounts with roles for current user */
  getWithAccess: () =>
    fetcher<ApiResponse<AccessAccount[]>>(ENDPOINTS.accounts.access, {
      method: "GET",
    }),

  /** GET single account by ID */
  getOne: (id: number) =>
    fetcher<ApiResponse<Account>>(ENDPOINTS.accounts.getOne(id), {
      method: "GET",
    }),

  /** UPDATE account by ID */
  update: (id: number, data: UpdateAccountDto) =>
    fetcher<ApiResponse<Account>>(ENDPOINTS.accounts.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** DELETE account by ID */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(ENDPOINTS.accounts.remove(id), {
      method: "DELETE",
    }),

  /** GET all active account types */
  getTypes: () =>
    fetcher<ApiResponse<AccountType[]>>(ENDPOINTS.accounts.types.all, {
      method: "GET",
    }),

  /** Assign a role to a user for an account */
  assignRole: (accountId: number, data: AssignRoleDto) =>
    fetcher<ApiResponse<null>>(ENDPOINTS.accounts.roles.assign(accountId), {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** List roles assigned to an account */
  getRoles: (accountId: number) =>
    fetcher<ApiResponse<any>>(ENDPOINTS.accounts.roles.list(accountId), {
      method: "GET",
    }),

  /** Update a user role for an account */
  updateRole: (accountId: number, userId: number, data: UpdateRoleDto) =>
    fetcher<ApiResponse<null>>(
      ENDPOINTS.accounts.roles.update(accountId, userId),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  /** Remove a user role from an account */
  removeRole: (accountId: number, userId: number) =>
    fetcher<ApiResponse<null>>(
      ENDPOINTS.accounts.roles.remove(accountId, userId),
      {
        method: "DELETE",
      }
    ),
};
