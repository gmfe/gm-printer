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
 * 规范化边框 gap；无效则 null
 */
export function normalizeBorderGap(gap) {
  if (!gap) return null
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = gap
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
 * 从外部选项生成写入模板的边框快照（含图片、边距，随模板保存）
 */
export function snapshotPageBorder(item) {
  if (!item || !item.id) return null
  const gap = normalizeBorderGap(item.gap)
  const snapshot = {
    id: item.id,
    name: item.name || '',
    imageUrl: item.imageUrl || '',
    pageTypes: item.pageTypes ? [...item.pageTypes] : []
  }
  if (gap) {
    snapshot.gap = gap
  }
  return snapshot
}

/**
 * 当前边框是否仍适用于 pageType
 * 优先用外部 pageBorderTypes；否则用已保存快照上的 pageTypes
 */
export function isPageBorderCompatible(types, border, pageType) {
  if (!border) return true
  const borderId = typeof border === 'string' ? border : border.id
  if (!borderId) return true
  if (types && types.length) {
    return !!filterPageBorderTypes(types, pageType).find(
      item => item.id === borderId
    )
  }
  const pageTypes =
    typeof border === 'object' ? border.pageTypes || [] : []
  return _.includes(pageTypes, pageType)
}

/**
 * 取边框自带边距（从选项列表或已保存快照）
 */
export function getPageBorderGap(types, borderOrId) {
  if (!borderOrId) return null
  if (typeof borderOrId === 'object') {
    return normalizeBorderGap(borderOrId.gap)
  }
  const item = findPageBorderType(types, borderOrId)
  return normalizeBorderGap(item && item.gap)
}

/**
 * 选中边框：有 gap 则用边框 gap，无 gap 则保持 currentGap
 * 清空边框：回退纸张默认 gap
 */
export function resolvePageGapForBorder({
  pageBorderTypes,
  border,
  pageType,
  currentGap
}) {
  if (border) {
    const borderGap = getPageBorderGap(pageBorderTypes, border)
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
 * 使用模板已保存的 border 快照（含 imageUrl），不依赖外部 pageBorderTypes
 */
export function getPageBorderBackgroundStyle({ border }) {
  if (!border || !border.imageUrl) return {}
  return {
    backgroundImage: `url(${border.imageUrl})`,
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

/** 兼容旧字段 page.borderId */
export function getSavedPageBorder(page) {
  if (!page) return null
  if (page.border && page.border.id) return page.border
  if (page.borderId) {
    return { id: page.borderId, name: '', imageUrl: '', pageTypes: [] }
  }
  return null
}
