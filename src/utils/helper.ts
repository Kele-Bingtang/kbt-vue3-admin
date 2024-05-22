import { isNumber, isString } from "./layout/validate";

/**
 * @description 数据解耦后，再返回（深拷贝函数）
 */
export function copyObj(obj: unknown) {
  return obj && JSON.parse(JSON.stringify(obj));
}

/**
 * @description 深拷贝函数
 */
export const deepClone = (obj: any, hash = new WeakMap()): Record<string, any> => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));

  if (hash.has(obj)) return hash.get(obj);

  const Constructor = obj.constructor;

  if (Constructor === Date) return new Date(obj);
  if (Constructor === RegExp) return new RegExp(obj);

  const newObj = new Constructor();
  hash.set(obj, newObj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key], hash);
    }
  }

  return newObj;
};

/**
 * 去重
 * @param arr 多个对象的数组
 * @param removeKeys 去重的 keys，数组形式
 * @param keyIsAndOr and：所有 key 都重复才去重；or：所有 key 中，任意一个 key 重复就去重
 * @returns 去重后的数组
 */
export function removeDuplicateObj<T>(arr: Array<T>, removeKeys: string[], keyIsAndOr: "and" | "or" = "and") {
  try {
    return arr.reduce((itemArr: any, next: any) => {
      const isSame = itemArr.find((item: any) => {
        if (keyIsAndOr === "and") {
          let isSame: boolean = true;
          removeKeys.forEach(key => {
            if (item[key] !== next[key]) {
              isSame = false;
            }
          });
          return isSame;
        } else {
          let isSame: boolean = false;
          removeKeys.forEach(key => {
            if (item[key] === next[key]) {
              isSame = true;
            }
          });
          return isSame;
        }
      });
      if (!isSame) {
        itemArr.push(next);
      }
      return itemArr;
    }, []);
  } catch (error) {
    return arr;
  }
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
  const browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = "";
  if (
    browserLang.toLowerCase() === "cn" ||
    browserLang.toLowerCase() === "zh" ||
    browserLang.toLowerCase() === "zh-cn"
  ) {
    defaultBrowserLang = "zh-CN";
  } else {
    defaultBrowserLang = "en-US";
  }
  return defaultBrowserLang;
}

/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function getTimeState() {
  // 获取当前时间
  const timeNow = new Date();
  // 获取当前小时
  const hours = timeNow.getHours();
  // 判断当前时间段
  if (hours >= 6 && hours <= 10) return `早上好 ⛅，新的一天就要开始啦，起来后来杯温水或者咖啡，动力满满喔 ~`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞，饭前喝口水，然后去吃最爱吃的饭，接着适当休息放松喔 ~`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞，繁忙的下午也不要忘记喝水、休息喔 ~`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛，休息啦，先吃晚饭，然后出去散散步，或者锻炼身体喔 ~`;
  if (hours >= 0 && hours <= 6) {
    return `凌晨好 🌛，没想到你那么努力，未来的美好悄然走向你，不过还是希望你早点休息，放下手上的事情，美滋滋的睡个好觉喔 ~`;
  }
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b) return false;
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    const propA = a[propName];
    const propB = b[propName];
    if (!b.hasOwnProperty(propName)) return false;
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false;
    } else if (propA !== propB) {
      return false;
    }
  }
  return true;
}

/**
 * @description 上传文件到本地浏览器
 */
export const uploadLocal = (file: File): Promise<{ blobInfo: any; file: File }> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      const id = "id" + new Date().getTime(); // 本地图片的文件名
      const base64 = (reader as any).result.split(",")[1];
      const blobInfo = { id, file, base64 };
      resolve({ blobInfo, file });
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 获取 URL ? 后面的参数
 */
export function getUrlParams(url = window.location.href) {
  // \w+ 表示匹配至少一个(数字、字母及下划线), [\u4e00-\u9fa5]+ 表示匹配至少一个中文字符
  const pattern = /(\w+|[\u4e00-\u9fa5]+)=(\w+|[\u4e00-\u9fa5]+)/gi;
  const result: any = {};
  url.replace(pattern, ($, $1, $2) => {
    result[$1] = $2;
    return "";
  });
  return result;
}

/**
 * 获取当前时间：yyyy-mm-dd HH:mm:ss
 */
export const getNowDate = () => {
  const date = new Date();
  const year = date.getFullYear(); // 年
  let month: string | number = date.getMonth() + 1; // 月
  let day: string | number = date.getDate(); // 日
  let hour: string | number = date.getHours(); // 时
  let minutes: string | number = date.getMinutes(); // 分
  let seconds: string | number = date.getSeconds(); // 秒
  // 给一位数的数据前面加 0
  if (month >= 1 && month <= 9) month = "0" + month;
  if (day >= 0 && day <= 9) day = "0" + day;
  if (hour >= 0 && hour <= 9) hour = "0" + hour;
  if (minutes >= 0 && minutes <= 9) minutes = "0" + minutes;
  if (seconds >= 0 && seconds <= 9) seconds = "0" + seconds;
  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
};

/**
 * 源数组是否包含目标数组的所有内容
 * @param arr 源数组
 * @param value 目标数组
 * @returns 包含：true，不包含：false
 */
export const isIncludeAll = (arr: string[], value: string[]) => {
  return value.every(v => arr.some(a => a === v));
  // return arr.some(a => value.includes(a));
};

/**
 * 源数组是否包含目标数组的某个内容
 * @param arr 源数组
 * @param value 目标数组
 * @returns 包含：true，不包含：false
 */
export const isIncludeSome = (arr: string[], value: string[]) => {
  return arr.some(a => value.includes(a));
};

/**
 * 设置 css var 需要的变量
 * @param key key
 * @param value value
 */
export const setStyleVar = (key: string, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop);
};

/**
 * 补 px 单位
 * @param val 值
 * @returns 补 px 单位的 string
 */
export const getPx = (val: number | string) => {
  if (isString(val)) {
    if (isNumber(val)) return `${val}px`;
    return val;
  }
  return `${val}px`;
};

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const get = (form: { [key: string]: any }, prop: string) => {
  if (!prop.includes(".")) return form[prop] ?? "";
  prop.split(".").forEach(item => (form = form[item] ?? ""));
  return form;
};

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const set = (form: { [key: string]: any }, prop: string, value: any) => {
  if (!form) return;
  const props = prop.split(".");
  let current = form;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];
    if (!current[prop]) current[prop] = {};
    current = current[prop];
  }

  current[props[props.length - 1]] = value;
};

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
};

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return "";
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase();
  });
};

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
};
