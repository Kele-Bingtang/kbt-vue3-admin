<template>
  <div :class="computedClasses" class="material-input-component">
    <div :class="{ iconClass: icon }">
      <CommonIcon v-if="icon" :icon="icon" class="material-input__icon" />
      <input
        v-if="type === 'email'"
        :id="id"
        v-model="valueCopy"
        type="email"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'url'"
        :id="id"
        v-model="valueCopy"
        type="url"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'number'"
        :id="id"
        v-model="valueCopy"
        type="number"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'password'"
        :id="id"
        v-model="valueCopy"
        type="password"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'tel'"
        :id="id"
        v-model="valueCopy"
        type="tel"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'text'"
        :id="id"
        v-model="valueCopy"
        type="text"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <span class="material-input-bar" />
      <label class="material-label">
        <slot />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts" name="MaterialInput">
import CommonIcon from "@/components/CommonIcon/index.vue";

interface MaterialInputProps {
  value: any;
  type?: string;
  id?: string;
  icon?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  minlength?: number;
  maxlength?: number;
  validateEvent?: boolean;
  activeColor?: string;
  theme?: string;
}
const props = withDefaults(defineProps<MaterialInputProps>(), {
  type: "text",
  id: "",
  icon: "",
  name: "",
  placeholder: "",
  readonly: false,
  disabled: false,
  required: true,
  autoComplete: "off",
  min: 0,
  max: 10000,
  step: 1,
  minlength: 0,
  maxlength: 20,
  validateEvent: true,
  activeColor: "#2196f3",
  theme: "",
});
const emits = defineEmits(["update:value", "focus", "blur"]);

const focus = ref(false);
const valueCopy = ref("");

const themeColor = computed(() => {
  const theme = props.theme;
  if (theme === "blue") {
    return "#2196f3";
  } else if (theme === "grey") {
    return "#9e9e9e";
  } else if (theme === "grey-light") {
    return "#e0e0e0";
  } else if (theme === "red") {
    return "#f44336";
  }
  return "";
});
const computedClasses = computed(() => ({
  "material--active": focus.value,
  "material--disabled": props.disabled,
  "material--raised": Boolean(focus.value || valueCopy.value),
}));

const filledPlaceholder = computed(() => {
  if (focus.value) {
    return props.placeholder;
  }
  return "";
});

watch(
  () => props.value,
  () => {
    valueCopy.value = props.value;
  }
);

onMounted(() => {
  valueCopy.value = props.value;
  const activeColor = themeColor.value ? themeColor.value : props.activeColor;
  document.styleSheets[0].insertRule(
    `.material-input-component.material--active .material-label { color: ${activeColor} !important}`,
    0
  );
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emits("update:value", value);
  const instance = getCurrentInstance();
  if ((instance?.parent as any).type.name === "ElFormItem") {
    if (props.validateEvent) {
      // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L293
      // eslint-disable-next-line vue/custom-event-name-casing
      (instance?.parent as any).emit("el.form.change", [value]);
    }
  }
};

const handleFocus = (event: FocusEvent) => {
  focus.value = true;
  emits("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  focus.value = false;
  emits("blur", event);
  const instance = getCurrentInstance();
  if ((instance?.parent as any).type.name === "ElFormItem") {
    if (props.validateEvent) {
      // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L292
      // eslint-disable-next-line vue/custom-event-name-casing
      (instance?.parent as any).$emit("el.form.blur", [valueCopy.value]);
    }
  }
};
</script>

<style lang="scss" scoped>
$font-size-base: 16px;
$font-size-small: 14px;
$font-size-smallest: 12px;
$font-weight-normal: normal;
$font-weight-bold: bold;

// Utils
$spacer: 10px;
$transition: 0.2s ease all;
$index-has-icon: 30px;

// Theme:
$color-white: white;
$color-grey: #9e9e9e;
$color-grey-light: #e0e0e0;
$color-blue: #2196f3;
$color-red: #f44336;
$color-black: black;

// Mixins:
@mixin slided-top() {
  /* stylelint-disable-next-line function-no-unknown */
  top: -($font-size-base + $spacer);
  left: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
}

// Base clases:
%base-bar-pseudo {
  content: "";
  height: 1px;
  width: 0;
  bottom: 0;
  position: absolute;
  transition: $transition;
}

.material-input-component {
  margin-top: 15px;
  position: relative;
  background: $color-white;

  &.material--active {
    .material-label {
      @include slided-top();

      color: $color-blue;
    }

    .material-input-bar {
      &::before,
      &::after {
        width: 50%;
      }
    }
  }

  * {
    box-sizing: border-box;
  }

  .iconClass {
    .material-input__icon {
      position: absolute;
      left: 0;
      line-height: $font-size-base;
      color: $color-blue;
      top: $spacer;
      width: $index-has-icon;
      height: $font-size-base;
      font-size: $font-size-base;
      font-weight: $font-weight-normal;
      pointer-events: none;
    }

    .material-label {
      left: $index-has-icon;
    }

    .material-input {
      text-indent: $index-has-icon;
    }
  }

  .material-input {
    font-size: $font-size-base;
    padding: $spacer $spacer $spacer calc($spacer / 2);
    display: block;
    width: 100%;
    border: none;
    border-radius: 0;
    background: none;
    color: $color-black;
    border-bottom: 1px solid $color-grey-light;

    &:focus {
      outline: none;
      border: none;
      border-bottom: 1px solid transparent; // fixes the height issue
    }
  }

  .material-label {
    font-size: $font-size-small;
    font-weight: $font-weight-normal;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    transition: $transition;
    color: $color-grey;
  }

  .material-input-bar {
    position: relative;
    display: block;
    width: 100%;

    &::before {
      @extend %base-bar-pseudo;

      background: $color-blue;
      left: 50%;
    }

    &::after {
      @extend %base-bar-pseudo;

      background: $color-blue;
      right: 50%;
    }
  }

  // Disabled state:
  &.material--disabled {
    .material-input {
      border-bottom-style: dashed;
    }
  }

  // Raised state:
  &.material--raised {
    .material-label {
      @include slided-top();
    }
  }

  // Errors:
  .material-errors {
    position: relative;
    overflow: hidden;

    .material-error {
      font-size: $font-size-smallest;
      line-height: $font-size-smallest + 2px;
      overflow: hidden;
      margin-top: 0;
      padding-top: calc($spacer / 2);
      padding-right: calc($spacer / 2);
      padding-left: 0;
    }
  }
}
</style>
