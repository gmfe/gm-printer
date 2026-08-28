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

/** 下拉选中「按明细单行」时的 value（detail_one_row） */
export function isDetailOneRowSelectKey(dataKey) {
  return getDataKeySuffix(dataKey) === 'detail_one_row'
}

export function isIndependentRolDataKey(dataKey) {
  const suffix = getDataKeySuffix(dataKey)
  return suffix === 'independent_rol_sku' || suffix === 'independent_rol_address'
}

export function isLastColDataKey(dataKey) {
  const suffix = getDataKeySuffix(dataKey)
  return suffix === 'last_col' || suffix === 'last_col_noLineBreak'
}
