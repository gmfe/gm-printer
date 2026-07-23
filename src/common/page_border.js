import _ from 'lodash'
import { pageTypeMap } from '../config'

/**
 * @param {Array<{id:string,name:string,imageUrl:string,pageTypes:string[],gap?:object}>} types
 * @param {string} pageType
 */
export function filterPageBorderTypes(types, pageType) {
  if (!types || !types.length || !pageType) return []
  return types.filter(
    item => item && _.includes(item.pageTypes || [], pageType)
  )
}

export function findPageBorderType(types, borderId) {
  if (!borderId || !types) return null
  return types.find(item => item && item.id === borderId) || null
}

/**
 * 当前 borderId 是否仍适用于 pageType；不适用则应清空
 */
export function isPageBorderCompatible(types, borderId, pageType) {
  if (!borderId) return true
  return !!filterPageBorderTypes(types, pageType).find(
    item => item.id === borderId
  )
}

/**
 * 取边框自带边距；无配置则返回 null（表示不覆盖 page.gap）
 */
export function getPageBorderGap(types, borderId) {
  const item = findPageBorderType(types, borderId)
  if (!item || !item.gap) return null
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = item.gap
  if (
    paddingTop == null &&
    paddingRight == null &&
    paddingBottom == null &&
    paddingLeft == null
  ) {
    return null
  }
  return {
    paddingTop: paddingTop || '0mm',
    paddingRight: paddingRight || '0mm',
    paddingBottom: paddingBottom || '0mm',
    paddingLeft: paddingLeft || '0mm'
  }
}

/**
 * 选中边框：有 gap 则用边框 gap，无 gap 则保持 currentGap
 * 清空边框：回退纸张默认 gap
 */
export function resolvePageGapForBorder({
  pageBorderTypes,
  borderId,
  pageType,
  currentGap
}) {
  if (borderId) {
    const borderGap = getPageBorderGap(pageBorderTypes, borderId)
    if (borderGap) return borderGap
    return currentGap ? { ...currentGap } : null
  }
  const defaultGap = pageTypeMap[pageType]?.gap
  if (defaultGap) {
    return { ...defaultGap }
  }
  return currentGap ? { ...currentGap } : null
}

/**
 * 生成要合并进 .gm-printer-page 的边框背景 style
 * 不满足条件时返回 {}
 */
export function getPageBorderBackgroundStyle({
  enablePageBorder,
  borderId,
  pageBorderTypes
}) {
  if (!enablePageBorder || !borderId) return {}
  const item = findPageBorderType(pageBorderTypes, borderId)
  if (!item || !item.imageUrl) return {}
  return {
    backgroundImage: `url(${item.imageUrl})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }
}

/**
 * pageStyle 在前，边框 background* 覆盖其上
 */
export function mergePageStyleWithBorder(pageStyle, borderStyle) {
  return {
    ...(pageStyle || {}),
    ...(borderStyle || {})
  }
}
