import { ElMessageBox, ElMessage } from "element-plus";

export namespace HandleData {
  export type MessageType = "" | "success" | "warning" | "info" | "error";
}

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const useHandleData = (
  fallback: () => void,
  message: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise(resolve => {
    ElMessageBox.confirm(`${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true,
    }).then(async () => {
      fallback();
      ElMessage({
        type: "success",
        message: `${message}成功!`,
      });
      resolve(true);
    });
  });
};
