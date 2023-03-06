import { useUserStore } from "@/stores/user";

export const usePermission = () => {
  const userStore = useUserStore();
  const checkPermission = (value: string[]): boolean => {
    if (value && value instanceof Array && value.length > 0) {
      const roles = userStore.roles;
      const permissionRoles = value;
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role);
      });
      return hasPermission;
    } else {
      console.error("need roles! Like v-permission=\"['admin','editor']\"");
      return false;
    }
  };
  return {
    checkPermission,
  };
};
