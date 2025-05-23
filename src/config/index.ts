import { createBaseConfig } from "./base-config";

// 系统配置
const config = {
  ...createBaseConfig(),
};

// 冻结对象防止运行时修改
export default Object.freeze(config);
