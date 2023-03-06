import type { Directive } from "vue";
import { useUserStore } from "@/stores/user";

const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const roles = useUserStore().roles;
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role);
      });
      if (!hasPermission) {
        // el.style.display = "none";
        (el as any).parentNode.removeChild(el);
      }
    } else {
      throw new Error("need roles! Like v-permission=\"['admin','visitor']\"");
    }
  },
};

export default permission;
