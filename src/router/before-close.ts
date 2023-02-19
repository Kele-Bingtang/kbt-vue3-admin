import { ElMessageBox } from "element-plus";

type BeforeCloseType = (value: unknown) => void;

interface BeforeClose {
  [key: string]: (resolve: BeforeCloseType) => void;
  before_close_normal: (resolve: BeforeCloseType) => void;
}

const beforeClose: BeforeClose = {
  before_close_normal: (resolve: any) => {
    ElMessageBox.confirm("确定要关闭这一页吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  },
};

export default beforeClose;
