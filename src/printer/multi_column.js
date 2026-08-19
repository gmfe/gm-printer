import { MULTI_SUFFIX, MULTI_SUFFIX3 } from '../config'
import { getMultiNumber, isMultiTable } from '../util'

export const INDEX_KEY = '序号'

const SPECIAL_ROW_KEYS = [
  '_special',
  '_diyCategorySubtotal',
  '_diyTagSubtotal',
  '_customTr'
]

export const getColSuffix = colIndex => {
  if (colIndex <= 0) return ''
  if (colIndex === 1) return MULTI_SUFFIX
  return MULTI_SUFFIX3
}

export const getSerialKeys = colNumber =>
  Array.from({ length: colNumber }, (_, c) => INDEX_KEY + getColSuffix(c))

/** 栏数：dataKey 的 multi/multi3，并用行上是否已有 _MULTI_SUFFIX 字段兜底 */
export const detectColNumber = (dataKey, rows) => {
  let n = isMultiTable(dataKey) ? getMultiNumber(dataKey) : 1
  const sample = (rows || []).find(
    row => row && !row._isEmptyData && !isSpecialTableRow(row)
  )
  if (sample) {
    const keys = Object.keys(sample)
    if (keys.some(key => key.endsWith(MULTI_SUFFIX3))) {
      n = Math.max(n, 3)
    } else if (keys.some(key => key.endsWith(MULTI_SUFFIX))) {
      n = Math.max(n, 2)
    }
  }
  return n
}

export const isSpecialTableRow = row =>
  !!(row && SPECIAL_ROW_KEYS.some(key => row[key]))

export const isFilledIndexValue = value => value !== '' && value != null

export const toSerialNumber = value => {
  if (!isFilledIndexValue(value)) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const splitKeyCol = key => {
  if (key.endsWith(MULTI_SUFFIX3)) {
    return { col: 2, base: key.slice(0, -MULTI_SUFFIX3.length) }
  }
  if (key.endsWith(MULTI_SUFFIX)) {
    return { col: 1, base: key.slice(0, -MULTI_SUFFIX.length) }
  }
  return { col: 0, base: key }
}

/** 把多栏打包行拆成各列的原始行数据 */
export const splitPackedRow = (row, colNumber) => {
  const cols = Array.from({ length: colNumber }, () => ({}))
  Object.keys(row || {}).forEach(key => {
    if (key === '_isEmptyData') return
    const { col, base } = splitKeyCol(key)
    if (col < colNumber) {
      cols[col][base] = row[key]
    }
  })
  return cols
}

const isRealItem = item => isFilledIndexValue(item?.[INDEX_KEY])

/** 横向多栏：每行从左到右拆出商品，得到原始顺序 */
export const flattenHorizontalPackedRows = (rows, colNumber) => {
  const items = []
  const cols = Math.max(colNumber || 1, 1)
  ;(rows || []).forEach(row => {
    if (!row || row._isEmptyData || isSpecialTableRow(row)) return
    if (cols <= 1) {
      items.push(row)
      return
    }
    splitPackedRow(row, cols).forEach(item => {
      if (isRealItem(item)) items.push(item)
    })
  })
  return items
}

/** 纵向整单打包：左列全部 + 右列全部，还原商品原始顺序 */
export const flattenVerticalSegment = (rows, colNumber) => {
  const columns = Array.from({ length: colNumber }, () => [])
  rows.forEach(row => {
    if (isSpecialTableRow(row)) return
    splitPackedRow(row, colNumber).forEach((item, col) => {
      if (isRealItem(item)) {
        columns[col].push(item)
      }
    })
  })
  return columns.reduce((list, col) => list.concat(col), [])
}

const assignItemToRow = (row, item, suffix) => {
  Object.keys(item).forEach(key => {
    if (key === '_isEmptyData') return
    row[key + suffix] = item[key]
  })
}

/**
 * 按「先填满当前页左列，再填右列」打包。
 * row r 的第 c 列对应 items[c * rowCount + r]
 */
export const packVerticalNewspaper = (
  items,
  colNumber,
  rowCount,
  fillIndex = false
) => {
  let nextSerial = 0
  items.forEach(item => {
    const n = toSerialNumber(item?.[INDEX_KEY])
    if (n != null && n >= nextSerial) {
      nextSerial = n + 1
    }
  })
  if (fillIndex && nextSerial < 1) {
    nextSerial = 1
  }

  const rows = []
  for (let r = 0; r < rowCount; r++) {
    const row = {}
    let hasRealItem = false
    for (let c = 0; c < colNumber; c++) {
      const item = items[c * rowCount + r]
      const suffix = getColSuffix(c)
      if (isRealItem(item)) {
        assignItemToRow(row, item, suffix)
        hasRealItem = true
      } else if (fillIndex) {
        row[INDEX_KEY + suffix] = nextSerial++
      } else {
        row[INDEX_KEY + suffix] = ''
      }
    }
    if (!hasRealItem) {
      row._isEmptyData = true
    }
    rows.push(row)
  }
  return rows
}

export const getMaxSerial = (rows, colNumber) => {
  let max = 0
  const keys = getSerialKeys(colNumber)
  ;(rows || []).forEach(row => {
    keys.forEach(key => {
      const n = toSerialNumber(row?.[key])
      if (n != null && n > max) max = n
    })
  })
  return max
}

/** 空白行补齐每一栏的序号 */
export const fillEmptyRowIndex = (
  item,
  index,
  lastKey,
  colNumber,
  fillIndex
) => {
  const next = { ...item }
  getSerialKeys(colNumber).forEach((key, col) => {
    next[key] = fillIndex ? lastKey + index * colNumber + col : ''
  })
  return next
}

/**
 * 渲染/插值前补齐当前行每一栏序号。
 * 空白行按「每行 × 栏数」续编；最后一行商品右侧空单元格也补上。
 */
export const ensureRowSerialKeys = (list, index, colNumber, fillIndex) => {
  const row = list?.[index]
  if (!row || !fillIndex || colNumber < 1 || isSpecialTableRow(row)) {
    return row
  }

  const keys = getSerialKeys(colNumber)
  const missing = keys.filter(key => !isFilledIndexValue(row[key]))
  if (!missing.length) return row

  const realRows = (list || []).filter(
    item => item && !item._isEmptyData && !isSpecialTableRow(item)
  )

  if (row._isEmptyData) {
    let max = getMaxSerial(realRows, colNumber)
    const lastReal = realRows[realRows.length - 1]
    if (lastReal) {
      keys.forEach(key => {
        if (!isFilledIndexValue(lastReal[key])) max += 1
      })
    }
    const emptyIndex = (list || [])
      .slice(0, index)
      .filter(item => item?._isEmptyData).length
    const next = { ...row }
    keys.forEach((key, col) => {
      next[key] = max + 1 + emptyIndex * colNumber + col
    })
    return next
  }

  const lastRealIndex = (list || []).reduce((acc, item, i) => {
    if (item && !item._isEmptyData && !isSpecialTableRow(item)) return i
    return acc
  }, -1)
  if (index !== lastRealIndex) return row

  let max = getMaxSerial(realRows, colNumber)
  const next = { ...row }
  keys.forEach(key => {
    if (!isFilledIndexValue(next[key])) {
      next[key] = ++max
    }
  })
  return next
}

/** 最后一行右侧空单元格续编序号 */
export const fillPartialLastRow = (rows, colNumber, fillIndex) => {
  if (!fillIndex || !rows?.length || colNumber <= 1) return rows
  const lastIndex = rows.length - 1
  const last = rows[lastIndex]
  if (!last || last._isEmptyData || isSpecialTableRow(last)) return rows

  let max = getMaxSerial(rows, colNumber)
  const next = { ...last }
  let changed = false
  getSerialKeys(colNumber).forEach(key => {
    if (!isFilledIndexValue(next[key])) {
      next[key] = ++max
      changed = true
    }
  })
  if (!changed) return rows
  const result = rows.slice()
  result[lastIndex] = next
  return result
}

const trailingEmptyEnd = (rows, from, to) => {
  let packEnd = to
  while (packEnd > from && rows[packEnd - 1]?._isEmptyData) {
    packEnd--
  }
  return packEnd
}

/**
 * 按分页区间把纵向多栏数据改成「每页先左后右」。
 * sourceItems 必须是未按页打包过的原始商品顺序（横向表或单栏表拆出）。
 * 分类小计等特殊行作为分段边界，不参与对半拆分。
 */
export const repackVerticalTableByPageRanges = (
  rows,
  colNumber,
  pageRanges,
  fillIndex = false,
  sourceItems
) => {
  if (!rows?.length || !pageRanges?.length || colNumber < 2) return rows
  const items =
    sourceItems && sourceItems.length
      ? sourceItems
      : flattenVerticalSegment(rows, colNumber)
  if (!items.length) return rows

  const result = rows.slice()
  let consumed = 0
  pageRanges.forEach(({ begin, end }) => {
    const packEnd = trailingEmptyEnd(rows, begin, Math.min(end, rows.length))
    let i = begin
    while (i < packEnd) {
      if (isSpecialTableRow(rows[i]) || rows[i]?._isEmptyData) {
        i++
        continue
      }
      let j = i
      while (
        j < packEnd &&
        !isSpecialTableRow(rows[j]) &&
        !rows[j]?._isEmptyData
      ) {
        j++
      }
      const rowCount = j - i
      if (rowCount <= 0) break
      const chunk = items.slice(consumed, consumed + rowCount * colNumber)
      const packed = packVerticalNewspaper(
        chunk,
        colNumber,
        rowCount,
        fillIndex
      )
      packed.forEach((row, offset) => {
        result[i + offset] = row
      })
      consumed += chunk.length
      i = j
    }
  })
  return result
}
