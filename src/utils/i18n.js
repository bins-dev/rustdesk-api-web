import en from "@/utils/i18n/en.json";
import zhCN from "@/utils/i18n/zh_CN.json";
import zhTW from "@/utils/i18n/zh_TW.json";
import { useAppStore } from "@/store/app";

const trans = {
  en: en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};
export function T(key, params, num = 0) {
  const appStore = useAppStore();
  const lang = appStore.setting.lang;
  const tran = trans[lang]?.[key];
  if (!tran) {
    return key;
  }
  const msg = num > 1 ? (tran.Other ? tran.Other : tran.One) : tran.One;
  return msg.replace(/{(\w+)}/g, function (match, key) {
    return params[key] || match;
  });
}
