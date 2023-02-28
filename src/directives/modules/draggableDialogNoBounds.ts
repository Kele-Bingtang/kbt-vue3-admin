import type { Directive } from "vue";

const draggableDialogNoBounds: Directive = {
  mounted(el) {
    const dialogHeaderEl: any = el.querySelector(".el-dialog__header");
    const dragDom: any = el.querySelector(".el-dialog");
    dialogHeaderEl.style.cssText += ";cursor:move;";
    dragDom.style.cssText += ";top:0px;";

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (() => {
      if ((window.document as any).currentStyle) {
        return (dom: { currentStyle: { [x: string]: any } }, attr: string | number) => dom.currentStyle[attr];
      } else {
        return (dom: Element, attr: any) => getComputedStyle(dom, null)[attr];
      }
    })();

    dialogHeaderEl.onmousedown = (e: any) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, "left");
      let styT = sty(dragDom, "top");

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, "") / 100);
      } else {
        styL = +styL.replace(/px/g, "");
        styT = +styT.replace(/px/g, "");
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const left = e.clientX - disX;
        const top = e.clientY - disY;
        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};

export default draggableDialogNoBounds;
