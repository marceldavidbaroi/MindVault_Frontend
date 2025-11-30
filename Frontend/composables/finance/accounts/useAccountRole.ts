// composables/useAccountRole.ts
import { useAccountStore } from "@/store/accountStore";

export function useAccountRole() {
  const accountStore = useAccountStore();

  // Fetch role and return all permissions at once
  const getPermissions = async (accountId: number) => {
    // Only fetch if accountId changes

    const res = await accountStore.getCurrentRole(accountId);

    const role = res?.data?.roleName;

    const isOwner = role === "owner";
    const isOwnerOrAdmin = isOwner || role === "admin";
    const canEdit = isOwnerOrAdmin || role === "editor";

    return {
      isOwner,
      isOwnerOrAdmin,
      canEdit,
    };
  };

  return {
    getPermissions,
  };
}
