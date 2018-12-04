import { i18nextInit } from 'gm-i18n'
import en from './en/default.json'
import zh from './zh/default.json'

// 初始化i18next
i18nextInit({
  resources: {
    'zh': {
      default: zh
    },
    'en': {
      default: en
    }
  }
})
