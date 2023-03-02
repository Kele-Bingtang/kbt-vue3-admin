/**
 * @description 数据解耦后，再返回
 */
export function copyObj(obj: unknown) {
  return obj && JSON.parse(JSON.stringify(obj));
}

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
  if (hours >= 6 && hours <= 10) return `早上好 ⛅，新的一天就要开始啦，来杯咖啡，动力满满喔 ~`;
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
