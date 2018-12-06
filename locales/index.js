import { i18next, getDefaultLng } from 'gm-i18n'
import en from './en/default.json'
import zh from './zh/default.json'

// 创建一个全新i18next示例,避免覆盖station中的实例
const i18n = i18next.createInstance()
i18n.init({
  lng: getDefaultLng(),
  // 当前语言包没提供翻译文件的时候,使用的默认语言
  fallbackLng: 'zh',
  // 没找到key的时候,做以下处理
  parseMissingKeyHandler: function (key) {
    const arr = key.split('#')
    return arr[arr.length - 1]
  },

  // 初始化是,加载的命名空间json文件
  ns: ['default'],
  // 默认命名空间
  defaultNS: 'default',

  // key分隔符
  keySeparator: '#',
  // 命名空间分割符
  nsSeparator: '@',

  interpolation: {
    escapeValue: false,
    prefix: '${',
    suffix: '}'
  },
  resources: {
    'zh': {
      default: zh
    },
    'en': {
      default: en
    }
  }
})

export default i18n
