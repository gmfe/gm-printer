/**
 * 模板 table.dataKey 前缀工具。
 * 采购模板：purchase_*；分拣明细模板：sorting_detail_*（后缀与采购一致）。
 */
export const SORTING_DETAIL_PREFIX = 'sorting_detail_'
export const PURCHASE_PREFIX = 'purchase_'

export function getDataKeyPrefix(dataKey) {
  if (dataKey?.startsWith(SORTING_DETAIL_PREFIX)) return SORTING_DETAIL_PREFIX
  return PURCHASE_PREFIX
}

export function getDataKeySuffix(dataKey) {
  if (!dataKey || typeof dataKey !== 'string') return ''
  return dataKey.replace(/^(sorting_detail_|purchase_)/, '')
}

export function buildDataKey(prefix, suffix) {
  return `${prefix}${suffix}`
}

/** 下拉选中「按明细单行」时的 value（detail_one_row），可带 category/multi 等后缀 */
export function isDetailOneRowSelectKey(dataKey) {
  const suffix = getDataKeySuffix(dataKey)
  return suffix === 'detail_one_row' || suffix.startsWith('detail_one_row_')
}

/** 独立滚动明细单行（sku/address），可带 category/multi 等后缀 */
export function isIndependentRolDataKey(dataKey) {
  const suffix = getDataKeySuffix(dataKey)
  return (
    suffix === 'independent_rol_sku' ||
    suffix === 'independent_rol_address' ||
    suffix.startsWith('independent_rol_sku_') ||
    suffix.startsWith('independent_rol_address_')
  )
}

/**
 * 从现有 dataKey 抽出可叠加修饰后缀（category / multi）
 * 用于切换 goods/merchant 排序时保留右键「商品分类」「双栏」状态
 */
export function getDataKeyModifierSuffix(dataKey) {
  const parts = getDataKeySuffix(dataKey).split('_').filter(Boolean)
  const modifiers = []
  if (parts.includes('category')) modifiers.push('category')
  if (parts.includes('multi')) modifiers.push('multi')
  return modifiers.length ? `_${modifiers.join('_')}` : ''
}

export function isLastColDataKey(dataKey) {
  const suffix = getDataKeySuffix(dataKey)
  return suffix === 'last_col' || suffix === 'last_col_noLineBreak'
}
