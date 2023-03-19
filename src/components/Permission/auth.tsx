import { defineComponent, Fragment } from "vue";
import { usePermission } from "@/hooks/usePermission";

export default defineComponent({
  name: "Auth",
  props: {
    value: {
      type: [String, Array<String>],
      default: "",
    },
  },
  setup(props, { slots }) {
    const { hasAuth } = usePermission();
    return () => {
      if (!slots) return null;
      return hasAuth(props.value as string | string[]) ? <Fragment>{slots.default?.()}</Fragment> : null;
    };
  },
});
