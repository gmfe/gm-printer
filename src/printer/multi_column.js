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

/** 去掉多栏后缀字段，避免旧右列残留被 assign 进新行 */
export const stripMultiSuffixFields = item => {
  if (!item || typeof item !== 'object') return item
  const next = {}
  Object.keys(item).forEach(key => {
    if (key === '_isEmptyData') return
    if (key.endsWith(MULTI_SUFFIX) || key.endsWith(MULTI_SUFFIX3)) return
    next[key] = item[key]
  })
  return next
}

/** 横向多栏：每行从左到右拆出商品，得到原始顺序 */
export const flattenHorizontalPackedRows = (rows, colNumber) => {
  const items = []
  const cols = Math.max(colNumber || 1, 1)
  ;(rows || []).forEach(row => {
    if (!row || row._isEmptyData || isSpecialTableRow(row)) return
    if (cols <= 1) {
      items.push(stripMultiSuffixFields(row))
      return
    }
    splitPackedRow(row, cols).forEach(item => {
      if (isRealItem(item)) items.push(stripMultiSuffixFields(item))
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
        columns[col].push(stripMultiSuffixFields(item))
      }
    })
  })
  return columns.reduce((list, col) => list.concat(col), [])
}

const assignItemToRow = (row, item, suffix) => {
  const clean = stripMultiSuffixFields(item) || {}
  Object.keys(clean).forEach(key => {
    row[key + suffix] = clean[key]
  })
}

/**
 * 按「先填满当前页左列，再填右列」打包。
 * row r 的第 c 列对应 items[c * rowCount + r]
 * 空单元格补序号也按列优先（先下后右），与商品落位一致。
 * @param {object} [options]
 * @param {number} [options.serialStart] 填充序号的起始值（含）
 */
export const packVerticalNewspaper = (
  items,
  colNumber,
  rowCount,
  fillIndex = false,
  options = {}
) => {
  const { serialStart } = options
  const rows = Array.from({ length: rowCount }, () => ({}))
  let maxSerial = 0
  ;(items || []).forEach(item => {
    const n = toSerialNumber(item?.[INDEX_KEY])
    if (n != null && n > maxSerial) maxSerial = n
  })
  if (serialStart != null && serialStart - 1 > maxSerial) {
    maxSerial = serialStart - 1
  }

  for (let c = 0; c < colNumber; c++) {
    for (let r = 0; r < rowCount; r++) {
      const item = (items || [])[c * rowCount + r]
      if (!isRealItem(item)) continue
      assignItemToRow(rows[r], item, getColSuffix(c))
    }
  }

  if (fillIndex) {
    let nextSerial = maxSerial
    for (let c = 0; c < colNumber; c++) {
      for (let r = 0; r < rowCount; r++) {
        const key = INDEX_KEY + getColSuffix(c)
        if (isFilledIndexValue(rows[r][key])) {
          const n = toSerialNumber(rows[r][key])
          if (n != null && n > nextSerial) nextSerial = n
          continue
        }
        rows[r][key] = ++nextSerial
      }
    }
  } else {
    for (let c = 0; c < colNumber; c++) {
      for (let r = 0; r < rowCount; r++) {
        const key = INDEX_KEY + getColSuffix(c)
        if (!isFilledIndexValue(rows[r][key])) {
          rows[r][key] = ''
        }
      }
    }
  }

  rows.forEach((row, r) => {
    let hasRealItem = false
    for (let c = 0; c < colNumber; c++) {
      if (isRealItem((items || [])[c * rowCount + r])) {
        hasRealItem = true
        break
      }
    }
    if (!hasRealItem) {
      row._isEmptyData = true
    }
  })
  return rows
}

/**
 * 横向多栏：每行从左到右落位（row r 的第 c 列 ← items[r * colNumber + c]）
 * 用于缺省 multi/multi3 表时从单栏商品生成打包数据。
 */
export const packHorizontalRowMajor = (items, colNumber) => {
  const cols = Math.max(colNumber || 1, 1)
  const list = items || []
  const rowCount = list.length ? Math.ceil(list.length / cols) : 0
  const rows = Array.from({ length: rowCount }, () => ({}))
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < cols; c++) {
      const item = list[r * cols + c]
      if (!isRealItem(item)) continue
      assignItemToRow(rows[r], item, getColSuffix(c))
    }
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
 * 按样板行生成空行骨架（拷贝字段为 ''），避免多栏模板读 undefined 抛错。
 * 并预留各栏序号字段。
 */
export const createEmptyRowSkeleton = (sampleRow, colNumber = 1) => {
  const skeleton = { _isEmptyData: true }
  if (sampleRow && typeof sampleRow === 'object') {
    Object.keys(sampleRow).forEach(key => {
      if (key === '_isEmptyData') return
      skeleton[key] = ''
    })
  }
  const cols = Math.max(colNumber || 1, 1)
  getSerialKeys(cols).forEach(key => {
    if (skeleton[key] === undefined) skeleton[key] = ''
  })
  return skeleton
}

export const createEmptyRows = (count, sampleRow, colNumber = 1) => {
  if (count <= 0) return []
  const skeleton = createEmptyRowSkeleton(sampleRow, colNumber)
  return Array.from({ length: count }, () => ({ ...skeleton }))
}

/**
 * 纵向多栏空行数：
 * - 仍有 _isEmptyData 时：用「总行 - 对半商品行」钉死（开关填充序号，避免 repack 吃空行）
 * - 已无空行标记时：走 fallback（remain/行高），供多栏/排列切换清空后重补
 *   （left-fill 会留下无 _isEmptyData 的多余商品行，不能当总行钉死）
 */
export const resolveVerticalEmptyCount = (
  tableLength,
  baseRowCount,
  fallbackEmptyCount = 0,
  hasEmptyMarked = false
) => {
  const base = Math.max(0, baseRowCount || 0)
  const pinned = Math.max(0, (tableLength || 0) - base)
  if (hasEmptyMarked && pinned > 0) return pinned
  return Math.max(0, fallbackEmptyCount || 0)
}

/**
 * 渲染/插值前补齐当前行每一栏序号。
 * 纵向表（_vertical）序号由 repack 统一生成，这里不再按横向公式补，避免断号/残留错觉。
 */
export const ensureRowSerialKeys = (
  list,
  index,
  colNumber,
  fillIndex,
  dataKey
) => {
  const row = list?.[index]
  if (!row || !fillIndex || colNumber < 1 || isSpecialTableRow(row)) {
    return row
  }
  // 纵向多栏：信任 repack 结果
  if (dataKey && /_vertical$/.test(dataKey)) {
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

/** 整段按列优先重编序号（先左列上→下，再右列），数据行与空行连续不断号 */
export const renumberSegmentSerialsColumnMajor = (
  rows,
  begin,
  end,
  colNumber,
  startSerial = 1
) => {
  let next = startSerial
  for (let c = 0; c < colNumber; c++) {
    for (let r = begin; r < end; r++) {
      const row = rows[r]
      if (!row || isSpecialTableRow(row)) continue
      const key = INDEX_KEY + getColSuffix(c)
      rows[r] = { ...row, [key]: next++ }
    }
  }
  return next
}

/**
 * 按分页区间把纵向多栏数据改成「每页先左后右」。
 * - 商品按序号灌满当前段左列再排右列（含空行的整段行数）
 * - 每一行都是新建对象，清除旧右列残留
 * - fillIndex 时整段按列重编序号，有数据/无数据同一套规则
 */
export const repackVerticalTableByPageRanges = (
  rows,
  colNumber,
  pageRanges,
  fillIndex = false,
  sourceItems
) => {
  if (!rows?.length || !pageRanges?.length || colNumber < 2) return rows
  const items = (sourceItems && sourceItems.length
    ? sourceItems
    : flattenVerticalSegment(rows, colNumber)
  ).map(stripMultiSuffixFields)

  if (!items.length && !fillIndex) return rows

  // 全新数组，避免与旧行对象共享引用
  const result = new Array(rows.length)
  for (let k = 0; k < rows.length; k++) {
    result[k] = rows[k]
  }

  let consumed = 0
  let nextSerial = 1
  pageRanges.forEach(({ begin, end }) => {
    const packEnd = Math.min(end, rows.length)
    let i = begin
    while (i < packEnd) {
      if (isSpecialTableRow(rows[i])) {
        result[i] = rows[i]
        i++
        continue
      }
      let j = i
      while (j < packEnd && !isSpecialTableRow(rows[j])) {
        j++
      }

      const rowCount = j - i
      if (rowCount <= 0) {
        i = j
        continue
      }

      const capacity = rowCount * colNumber
      const chunk = items.slice(consumed, consumed + capacity)
      const packed = packVerticalNewspaper(chunk, colNumber, rowCount, false)
      packed.forEach((row, offset) => {
        result[i + offset] = row
      })
      consumed += chunk.length

      if (fillIndex) {
        nextSerial = renumberSegmentSerialsColumnMajor(
          result,
          i,
          j,
          colNumber,
          nextSerial
        )
      }

      i = j
    }
  })
  return result
}
