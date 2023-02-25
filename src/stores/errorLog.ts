import { defineStore } from "pinia";
import type { ErrorLog } from ".";
import { useUserStore } from "./user";

export const useErrorLogStore = defineStore("errorLogStore", () => {
  const errorLogs = ref<ErrorLog[]>([]);

  const addErrorLog = (errorLog: ErrorLog) => {
    const userStore = useUserStore();
    const { userInfo, token, roles } = userStore;
    const log: ErrorLog = {
      ...errorLog,
      userId: userInfo.userId,
      username: userInfo.username,
      token,
      roles,
      time: new Date().getTime(),
    };
    errorLogs.value.push(log);
  };

  const deleteOneErrorLog = (errorLog: ErrorLog) => {
    for (const [i, e] of errorLogs.value.entries()) {
      if (e.time === errorLog.time) {
        errorLogs.value.splice(i, 1);
        break;
      }
    }
  };

  const clearErrorLog = () => {
    errorLogs.value.splice(0);
  };

  const setHasReadErrorLogsStatus = (status: boolean) => {
    errorLogs.value = errorLogs.value.map(errorLog => {
      errorLog.hasRead = status;
      return errorLog;
    });
  };
  return {
    errorLogs,
    addErrorLog,
    deleteOneErrorLog,
    clearErrorLog,
    setHasReadErrorLogsStatus,
  };
});
