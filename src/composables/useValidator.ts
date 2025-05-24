import type { FormItemRule } from "element-plus";

interface LengthRange {
  min: number;
  max: number;
  message?: string;
}

/**
 * 返回 EP 表单验证的规则
 */
export const useValidator = () => {
  const required = (message?: string): FormItemRule => {
    return {
      required: true,
      message: message || "该项为必填项",
    };
  };

  const lengthRange = (options: LengthRange): FormItemRule => {
    const { min, max, message } = options;

    return {
      min,
      max,
      message: message || `长度在 ${min} 到 ${max} 个字符`,
    };
  };

  const notSpace = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (val?.indexOf(" ") !== -1) {
          callback(new Error(message || "不能包含空格"));
        } else {
          callback();
        }
      },
    };
  };

  const notSpecialCharacters = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
          callback(new Error(message || "不能包含特殊字符"));
        } else {
          callback();
        }
      },
    };
  };

  const phone = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();
        if (!/^1[3456789]\d{9}$/.test(val)) {
          callback(new Error(message || "请输入正确的手机号码"));
        } else {
          callback();
        }
      },
    };
  };

  const email = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();
        if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val)) {
          callback(new Error(message || "请输入正确的邮箱"));
        } else {
          callback();
        }
      },
    };
  };

  const maxlength = (max: number): FormItemRule => {
    return {
      max,
      message: "长度不能超过" + max + "个字符",
    };
  };

  const check = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) {
          callback(new Error(message || "两个值不相等"));
        } else {
          callback();
        }
      },
    };
  };

  return {
    required,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    phone,
    email,
    maxlength,
    check,
  };
};
