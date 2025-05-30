import { StarFilled, Lock } from "@element-plus/icons-vue";

const permissionRoutes = {
  path: "/permission",
  redirect: "/permission/switch",
  name: "Permission",
  meta: {
    title: "权限",
    icon: Lock,
    roles: ["admin", "visitor"],
    alwaysShowRoot: true,
  },
  children: [
    {
      path: "switch",
      component: () => import("@/views/permission/switchPermission.vue"),
      name: "SwitchPermission",
      meta: {
        title: "权限切换",
        auths: ["btn_add", "btn_edit", "btn_delete"],
        icon: StarFilled,
      },
    },
    {
      path: "role",
      component: () => import("@/views/permission/rolePermission.vue"),
      name: "RolePermission",
      meta: {
        title: "权限编辑",
        roles: ["admin"],
        icon: StarFilled,
      },
    },
  ],
};

export default permissionRoutes;
