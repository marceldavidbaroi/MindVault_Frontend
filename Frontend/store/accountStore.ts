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
  UpdateRoleDto,
} from "@/types/Account.type";

interface AccountState {
  accounts: Account[];
  selectedAccountId: string | number | null;
  selectedAccount: any | null;
  accessAccounts: AccessAccount[];
  accountTypes: AccountType[];
  accountRoles: Record<number, AccountRole[]>; // key = accountId
  currentRole: string | null; // <--- Add this

  setAccounts: (accounts: Account[]) => void;
  setSelectedAccountId: (selectedAccountId: number | string | null) => void;
  setSelectedAccount: (selectedAccount: Account | null) => void;
  setAccessAccounts: (accounts: AccessAccount[]) => void;
  setAccountTypes: (types: AccountType[]) => void;
  setAccountRoles: (accountId: number, roles: AccountRole[]) => void;
  setCurrentRole: (role: string | null) => void; // <--- Add this

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
    data: UpdateRoleDto
  ) => Promise<any>;
  removeAccountRole: (accountId: number, userId: number) => Promise<any>;
  getCurrentRole: (accountId: number) => Promise<any>; // <--- Already exists
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  selectedAccountId: null,
  accessAccounts: [],
  accountTypes: [],
  accountRoles: {},
  currentRole: null, // <--- initialize

  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  setSelectedAccountId: (selectedAccountId) => set({ selectedAccountId }),
  setAccessAccounts: (accessAccounts) => set({ accessAccounts }),
  setAccountTypes: (accountTypes) => set({ accountTypes }),
  setAccountRoles: (accountId, roles) =>
    set({ accountRoles: { ...get().accountRoles, [accountId]: roles } }),
  setCurrentRole: (role) => set({ currentRole: role }), // <--- setter

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
    if (res.success) set({ selectedAccount: res.data });
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

  // Get current role for selected account
  getCurrentRole: async (accountId) => {
    const res = await accountService.getCurrentRole(accountId);
    if (res.success) get().setCurrentRole(res.data.roleName); // <--- set the role
    return res;
  },
}));
