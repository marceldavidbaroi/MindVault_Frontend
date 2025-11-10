// store/accountStore.ts
import { create } from "zustand";
import { accountService } from "@/services/accountsService";
import {
  Account,
  AccountType,
  CreateAccountDto,
  UpdateAccountDto,
  AssignRoleDto,
  AccountRole,
  AccessAccount,
} from "@/types/Account.type";

interface AccountState {
  accounts: Account[];
  accessAccounts: AccessAccount[];
  accountTypes: AccountType[];
  accountRoles: Record<number, AccountRole[]>; // key = accountId

  setAccounts: (accounts: Account[]) => void;
  setAccessAccounts: (accounts: AccessAccount[]) => void;
  setAccountTypes: (types: AccountType[]) => void;
  setAccountRoles: (accountId: number, roles: AccountRole[]) => void;

  getMyAccounts: () => Promise<any>;
  getAccountsWithAccess: () => Promise<any>;
  getAccount: (id: number) => Promise<any>;
  createAccount: (data: CreateAccountDto) => Promise<any>;
  updateAccount: (id: number, data: UpdateAccountDto) => Promise<any>;
  deleteAccount: (id: number) => Promise<any>;

  getAllAccountTypes: () => Promise<any>;

  getAccountRoles: (accountId: number) => Promise<any>;
  assignAccountRole: (accountId: number, data: AssignRoleDto) => Promise<any>;
  updateAccountRole: (
    accountId: number,
    userId: number,
    data: AssignRoleDto
  ) => Promise<any>;
  removeAccountRole: (accountId: number, userId: number) => Promise<any>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  accessAccounts: [],
  accountTypes: [],
  accountRoles: {},

  setAccounts: (accounts) => set({ accounts }),
  setAccessAccounts: (accessAccounts) => set({ accessAccounts }),
  setAccountTypes: (accountTypes) => set({ accountTypes }),
  setAccountRoles: (accountId, roles) =>
    set({ accountRoles: { ...get().accountRoles, [accountId]: roles } }),

  // Accounts
  getMyAccounts: async () => {
    const res = await accountService.getMy();
    if (res.success) set({ accounts: res.data });
    return res;
  },

  getAccountsWithAccess: async () => {
    const res = await accountService.getWithAccess();
    if (res.success) set({ accessAccounts: res.data });
    return res;
  },

  getAccount: async (id) => {
    const res = await accountService.getOne(id);
    return res;
  },

  createAccount: async (data) => {
    const res = await accountService.create(data);
    if (res.success) set({ accounts: [res.data, ...(get().accounts || [])] });
    return res;
  },

  updateAccount: async (id, data) => {
    const res = await accountService.update(id, data);
    if (res.success) {
      set({
        accounts: (get().accounts || []).map((a) =>
          a.id === id ? res.data : a
        ),
      });
    }
    return res;
  },

  deleteAccount: async (id) => {
    const res = await accountService.remove(id);
    if (res.success) {
      set({ accounts: (get().accounts || []).filter((a) => a.id !== id) });
    }
    return res;
  },

  // Account Types
  getAllAccountTypes: async () => {
    const res = await accountService.getTypes();
    if (res.success) set({ accountTypes: res.data });
    return res;
  },

  // Account Roles
  getAccountRoles: async (accountId) => {
    const res = await accountService.getRoles(accountId);
    if (res.success) get().setAccountRoles(accountId, res.data);
    return res;
  },

  assignAccountRole: async (accountId, data) => {
    const res = await accountService.assignRole(accountId, data);
    if (res.success) await get().getAccountRoles(accountId);
    return res;
  },

  updateAccountRole: async (accountId, userId, data) => {
    const res = await accountService.updateRole(accountId, userId, data);
    if (res.success) await get().getAccountRoles(accountId);
    return res;
  },

  removeAccountRole: async (accountId, userId) => {
    const res = await accountService.removeRole(accountId, userId);
    if (res.success) await get().getAccountRoles(accountId);
    return res;
  },
}));
