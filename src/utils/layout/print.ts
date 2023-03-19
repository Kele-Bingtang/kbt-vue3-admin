const Print = function (this: any, dom: string | HTMLElement, options?: object) {
  const _this: any = this;
  options = options || {};
  // @ts-expect-error
  if (!(this instanceof Print)) return new Print(dom, options);
  _this.conf = {
    styleStr: "",
    // Elements that need to dynamically get and set the height
    setDomHeightArr: [],
    // Callback before printing
    printBeforeFn: null,
    // Callback after printing
    printDoneCallBack: null,
  };
  for (const key in _this.conf) {
    // eslint-disable-next-line no-prototype-builtins
    if (key && options.hasOwnProperty(key)) {
      _this.conf[key] = (options as any)[key];
    }
  }
  if (typeof dom === "string") {
    _this.dom = document.querySelector(dom);
  } else {
    _this.dom = _this.isDOM(dom) ? dom : (dom as any).$el;
  }
  if (_this.conf.setDomHeightArr && _this.conf.setDomHeightArr.length) {
    _this.setDomHeight(_this.conf.setDomHeightArr);
  }
  _this.init();
};

Print.prototype = {
  /**
   * init
   */
  init: function (): void {
    const content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  /**
   * Configuration property extension
   * @param {Object} obj
   * @param {Object} obj2
   */
  // eslint-disable-next-line space-before-function-paren
  extendOptions: function <T>(obj: any, obj2: T): T {
    for (const k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },
  /**
    Copy all styles of the original page
  */
  getStyle: function (): string {
    let str = "";
    const styles: NodeListOf<Element> = document.querySelectorAll("style,link");
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += `<style>.no-print{display:none;}${this.conf.styleStr}</style>`;
    return str;
  },
  // form assignment
  getHtml: function (): Element {
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");
    const textareas = document.querySelectorAll("textarea");
    const canvass = document.querySelectorAll("canvas");

    for (let k = 0; k < inputs.length; k++) {
      if (inputs[k].type === "checkbox" || inputs[k].type === "radio") {
        if (inputs[k].checked === true) {
          inputs[k].setAttribute("checked", "checked");
        } else {
          inputs[k].removeAttribute("checked");
        }
      } else if (inputs[k].type === "text") {
        inputs[k].setAttribute("value", inputs[k].value);
      } else {
        inputs[k].setAttribute("value", inputs[k].value);
      }
    }

    for (let k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type === "textarea") {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (let k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type === "select-one") {
        const child = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName === "OPTION") {
            if ((child[i] as any).selected === true) {
              child[i].setAttribute("selected", "selected");
            } else {
              child[i].removeAttribute("selected");
            }
          }
        }
      }
    }

    for (let k4 = 0; k4 < canvass.length; k4++) {
      const imageURL = canvass[k4].toDataURL("image/png");
      const img = document.createElement("img");
      img.src = imageURL;
      img.setAttribute("style", "max-width: 100%;");
      img.className = "isNeedRemove";
      canvass[k4].parentNode?.insertBefore(img, canvass[k4].nextElementSibling);
    }

    return this.dom.outerHTML;
  },
  /**
    create iframe
  */
  writeIframe: function (content: string) {
    let w: Document | Window | null = null;
    let doc: Document | null = null;
    const iframe: HTMLIFrameElement = document.createElement("iframe");
    const f: HTMLIFrameElement = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    iframe.setAttribute("style", "position:absolute;width:0;height:0;top:-10px;left:-10px;");
    // eslint-disable-next-line prefer-const
    w = f.contentWindow || f.contentDocument;
    // eslint-disable-next-line prefer-const
    doc = f.contentDocument || f.contentWindow?.document || null;
    doc?.open();
    doc?.write(content);
    doc?.close();
    const removes = document.querySelectorAll(".isNeedRemove");
    for (let k = 0; k < removes.length; k++) {
      removes[k].parentNode?.removeChild(removes[k]);
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    iframe.onload = function (): void {
      // Before popping, callback
      if (_this.conf.printBeforeFn) {
        _this.conf.printBeforeFn({ doc });
      }
      _this.toPrint(w);
      setTimeout(function () {
        document.body.removeChild(iframe);
        // After popup, callback
        if (_this.conf.printDoneCallBack) {
          _this.conf.printDoneCallBack();
        }
      }, 100);
    };
  },
  /**
    Print
  */
  toPrint: function (frameWindow: Window): void {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand("print", false, "")) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.error(err);
    }
  },
  isDOM:
    typeof HTMLElement === "object"
      ? (obj: any) => obj instanceof HTMLElement
      : (obj: any) => obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string",
  /**
   * Set the height of the specified dom element by getting the existing height of the dom element and setting
   * @param {Array} arr
   */
  setDomHeight(arr: string[]) {
    if (arr && arr.length) {
      arr.forEach(name => {
        const domArr = document.querySelectorAll(name);
        domArr.forEach((dom: any) => {
          dom.style.height = dom.offsetHeight + "px";
        });
      });
    }
  },
};

export default Print;
