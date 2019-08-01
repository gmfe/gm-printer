import lng1 from './zh.json'
import lng2 from './zh-HK.json'
import lng3 from './en.json'
import lng4 from './th.json'
const moduleMap = {
  'zh': lng1,
  'zh-HK': lng2,
  'en': lng3,
  'th': lng4
}
let _language = 'zh'

const setLocale = lng => {
  _language = lng
}

const getLocale = key => {
  const languageMap = moduleMap[_language] || moduleMap['zh']
  let result = languageMap[key]

  if (!result) {
    result = key.split('__').pop()
  }

  return result
}
// 兼容旧的
const i18next = {
  t: getLocale
}
export { getLocale, setLocale }
export default i18next
