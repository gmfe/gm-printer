import _ from 'lodash'
import Big from 'big.js'

function getHeight(el) {
  const styles = window.getComputedStyle(el)
  const height = el.offsetHeight
  const borderTopWidth = parseFloat(styles.borderTopWidth)
  const borderBottomWidth = parseFloat(styles.borderBottomWidth)
  const paddingTop = parseFloat(styles.paddingTop)
  const paddingBottom = parseFloat(styles.paddingBottom)
  return (
    height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom
  )
}

function getWidth(el) {
  const styles = window.getComputedStyle(el)
  // 取width保留小数点用 getBoundClientRect
  const style = el.getBoundingClientRect()
  const width = Math.round(style.width * 100) / 100 // 保留两位小数并四舍五入
  const borderLeftWidth = parseFloat(styles.borderLeftWidth)
  // const borderRightWidth = parseFloat(styles.borderRightWidth)
  const paddingLeft = parseFloat(styles.paddingLeft)
  const paddingRight = parseFloat(styles.paddingRight)
  return width - borderLeftWidth - paddingLeft - paddingRight
}

function pxAdd(origin = '0px', add) {
  origin = origin.replace('px', '')

  return parseInt(~~origin, 10) + add + 'px'
}

function getStyleWithDiff(style, diffX, diffY) {
  const newStyle = Object.assign({}, style)

  if (!style.left && style.right) {
    newStyle.right = pxAdd(newStyle.right, -diffX)
  } else {
    newStyle.left = pxAdd(newStyle.left, diffX)
  }

  if (!style.top && style.bottom) {
    newStyle.bottom = pxAdd(newStyle.bottom, -diffY)
  } else {
    newStyle.top = pxAdd(newStyle.top, diffY)
  }

  return newStyle
}

function getBlockName(name, index) {
  return `${name}.block.${index}`
}

function getTableColumnName(name, index) {
  return `${name}.column.${index}`
}

function insertCSS(cssString, target) {
  const style = window.document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(cssString))

  if (target) {
    target.appendChild(style)
  } else {
    window.document.head.appendChild(style)
  }
}

function dispatchMsg(event, data) {
  window.document.dispatchEvent(
    new window.CustomEvent(event, {
      detail: data
    })
  )
}

function exchange(arr, target, source) {
  ;[arr[target], arr[source]] = [arr[source], arr[target]]
  return arr
}

let timer

function afterImgAndSvgLoaded(callback, $printer) {
  const $imgList = $printer.querySelectorAll('img')
  const $svgList = $printer.querySelectorAll('svg')

  clearTimeout(timer)

  const everyThingIsOk =
    _.every($imgList, img => img.complete) &&
    _.every($svgList, svg => svg.children.length)
  if (everyThingIsOk) {
    callback()
  } else {
    timer = setTimeout(afterImgAndSvgLoaded.bind(this, callback, $printer), 300)
  }
}

function getSumTrHeight(SumTr) {
  const { style = {} } = SumTr
  const fontSize = style.fontSize || '12px'

  // 12px => 26, 14px => 29, 16px => 33, ...
  return (parseInt(fontSize) - 12) * 1.5 + 26
}

function getOverallOrderTrHeight(overallOrder) {
  const { fields = [] } = overallOrder
  const fontSize = fields?.[0]?.style?.fontSize || '12px'

  // 12px => 26, 14px => 29, 16px => 33, ...
  return (parseInt(fontSize) - 12) * 1.5 + 26
}

// eslint-disable-next-line
const coverDigit2Uppercase = n => {
  if (_.isNil(n) || _.isNaN(n)) {
    return '-'
  }

  const fraction = ['角', '分']

  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']

  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]

  const head = n < 0 ? '欠' : ''

  n = Math.abs(n)

  let left = ''
  let right = ''
  let i = 0
  for (i; i < fraction.length; i++) {
    right +=
      digit[
        Math.floor(
          Big(n)
            .times(Big(10).pow(i + 1))
            .mod(10)
            .toString()
        )
      ] + fraction[i]
  }
  // 1.06 --- 壹元零陆分
  right = right.replace(/(零分)/, '').replace(/(零角)/, '零')
  // 1.00 --- 壹元整
  right = right === '零' ? '整' : right
  // 1.60 --- 壹元陆角整 1.66 --- 壹元陆角陆分
  right = /角$/.test(right) ? right + '整' : right
  n = Math.floor(n)

  for (i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    left = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + left
  }

  return (
    head +
    (left.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零') + right).replace(
      /^整$/,
      '零元整'
    )
  )
}

// 是不是多栏table
const isMultiTable = dataKey => dataKey.includes('multi')

// 获取table有多少栏,最少是双栏
const getMultiNumber = dataKey => {
  const reg = /multi(\d)?/
  const result = reg.exec(dataKey)
  return Number(result[1]) || 2
}

// 由于增加了商品排列（横向排列，纵向排列），所以统一用这个获取dataKey
const getDataKey = (dataKey, arrange) =>
  arrange === 'vertical' && isMultiTable(dataKey)
    ? `${dataKey}_vertical`
    : dataKey

/**
 * @param {*} detailsHeights 当钱明细高度集
 * @param {*} detailsData 当前所有tablelist
 * @param {*} curRemainPageHeight 可容纳table的总高度
 * @returns {ranges, detailsPageHeight} detailsPageHeight 每页高度合集
 */
const caclSingleDetailsPageHeight = (detailsHeights, curRemainPageHeight) => {
  let [end, deadline] = [0, 0]
  const begin = 0
  /** 当前明细高度，默认为tr的border+padding的height */
  let currentDetailsMiniHeight = 5
  const ranges = []
  const detailsPageHeight = []
  /** 未进行计算的高度，留到下一次, 默认为tr的border+padding的height */
  let remainDetailsHeight = 5

  // 如果当前累计高度高于当前剩余高度，则跳出返回
  while (end < detailsHeights.length) {
    const height = currentDetailsMiniHeight + detailsHeights[end]
    if (height < curRemainPageHeight) {
      currentDetailsMiniHeight = height
      deadline++
    } else {
      remainDetailsHeight += detailsHeights[end]
    }
    end++
  }

  ranges.push([begin, deadline], [deadline, end])
  detailsPageHeight.push(currentDetailsMiniHeight, remainDetailsHeight)

  return {
    ranges,
    detailsPageHeight
  }
}

/**
 * 取数组中位数, 有数量相同的则取最小的那个
 * @param {*} arr
 */
const getArrayMid = arr => {
  /** 数组元素出现次数的集合 */
  const mapArr = []
  const map = new Map()
  let majority = 23
  /** 次数相同的元素集合 */
  const majorityArr = []
  const min = Math.min(...arr)

  if (arr.length === 0) return majority

  _.forEach(arr, (val, key) => {
    if (map.has(val)) {
      map.set(val, map.get(val) + 1)
    } else {
      map.set(val, 1)
    }
  })

  for (const val of map.values()) {
    mapArr.push(val)
  }
  // 如果没有众数，就取最小值
  if (Array.from(new Set(mapArr)).length === 1) {
    // 如果说min也远远大于23， 就返回23吧
    if (min / 23 > 10) {
      return 23
    }
    return min
  }

  const maxCount = Math.max(...mapArr)
  for (const val of map.keys()) {
    if (map.get(val) === maxCount) {
      majorityArr.push(val)
    }
  }
  majority = Math.min(...majorityArr)
  // 如果说取的众数也远远大于min，
  if (majority / min > 3) {
    // 如果说min也远远大于23， 就返回23吧
    if (min / 23 > 10) {
      return 23
    }
    return min
  }

  return majority
}

/**
 * 获取整单合计colSpan合并的个数
 * @param {*} table
 * @returns number
 */
const getColSpanLength = table => {
  return /multi/.test(table.dataKey)
    ? getMultiNumber(table.dataKey) * table.columns.length
    : table.columns.length
}

/**
 * 收集分类小计的组
 * @param {*} tableData
 * @param {*} range
 * @param {*} key
 * @returns
 */
const collectGroups = (tableData, range, key = '_collect') => {
  const groups = []
  let currentGroup = []
  let currentStart = 0

  // for (let idx = range.begin; idx < range.end; idx++) {
  //   const row = tableData[idx]
  //   const isSpecial = row && row[key]

  //   if (isSpecial) {
  //     if (currentGroup.length) {
  //       groups.push({
  //         groupKey: extractCategoryName(row[key]?.text),
  //         begin: currentStart,
  //         end: idx,
  //         specialIndex: idx
  //       })
  //       currentGroup = []
  //     }
  //     currentStart = idx + 1
  //   } else if (row && Object.keys(row).length) {
  //     currentGroup.push(row)
  //   }
  // }

  for (let idx = 0; idx < tableData.length; idx++) {
    const row = tableData[idx]
    const isSpecial = row && row[key]
    if (isSpecial) {
      if (currentGroup.length) {
        groups.push({
          groupKey: extractCategoryName(row[key]?.text),
          begin: currentStart,
          end: idx,
          specialIndex: idx
        })
        currentGroup = []
      }
      currentStart = idx + 1
    } else if (row && Object.keys(row).length) {
      currentGroup.push(row)
    }
  }

  return groups

  function extractCategoryName(text) {
    if (!text) return ''
    const match = text.match(/^(.*?)[：:]/)
    return match ? match[1] : ''
  }
}

/**
 * 使用精度格式化函数格式化 Big.js 求和结果，无格式化函数时兜底 toFixed(2)
 * @param {Big} sum - Big.js 实例
 * @param {Function} [formatter] - 可选的精度格式化函数
 * @returns {string}
 */
const formatSumWithPrecision = (sum, formatter) => {
  return formatter ? formatter(sum).toFixed() : sum.toFixed(2)
}

/**
 * 根据高精度字段映射，获取求和时应使用的字段名
 * 如果字段有对应的高精度版本，返回高精度字段名，否则返回原字段名
 * @param {string} field - 原始字段名
 * @param {Object} mapping - 高精度字段映射，格式：{ normalField: 'high_precision_field' }
 * @returns {string}
 */
const getHighPrecisionField = (field, mapping) => {
  return mapping?.[field] || field
}

/**
 * 打印模板内置金额格式化（与 printerStore.template 注入的 price 一致）
 * @param {*} n
 * @param {number} [f=2]
 * @returns {string|null}
 */
const price = (n, f = 2) => {
  if (isNaN(n)) return null
  return Big(n || 0).toFixed(f)
}

/**
 * 从合计配置解析用于求和的字段名
 * 支持：出库金额 / {{出库金额}} / {{列.出库金额}} / {{price(出库金额,1)}} / {{price(列.出库金额)}}
 * @param {string} text
 * @returns {string}
 */
const extractSumField = text => {
  if (text == null || text === '') return text
  if (typeof text !== 'string') return text
  if (!text.includes('{{')) return text

  const priceMatch = text.match(
    /price\s*\(\s*(?:列\.)?\s*([^,)]+?)(?:\s*,|\s*\))/
  )
  if (priceMatch) return priceMatch[1].trim()

  const colMatch = text.match(/\{\{\s*列\.([^}]+?)\s*\}\}/)
  if (colMatch) return colMatch[1].trim()

  const bareMatch = text.match(/\{\{\s*([^{}()]+?)\s*\}\}/)
  if (bareMatch) return bareMatch[1].trim()

  return text
}

/**
 * 对合计结果做 lodash 模板渲染并注入内置 price；无模板语法时原样返回合计值
 * 语法错误时与 printerStore.template 一致：返回原文
 * @param {string} text - valueField 或列 text
 * @param {string|number} sumValue - 已求得的合计值
 * @param {string} [fieldKey] - 字段名，默认从 text 解析
 * @returns {string|number}
 */
const templateSumResult = (text, sumValue, fieldKey) => {
  if (text == null || text === '' || typeof text !== 'string') {
    return sumValue
  }
  if (!text.includes('{{')) {
    return sumValue
  }

  const key = fieldKey || extractSumField(text)
  try {
    return _.template(text, {
      interpolate: /{{([\s\S]+?)}}/g
    })({
      price,
      [key]: sumValue,
      列: { [key]: sumValue }
    })
  } catch (err) {
    return text
  }
}

/**
 * 将合计配置转为用于逐行取值的列模板（去掉 price，仅保留 {{列.字段}}）
 * @param {string} text
 * @returns {string}
 */
const toSumColTemplate = text => {
  const key = extractSumField(text)
  return `{{列.${key}}}`
}

/**
 * 判断自定义合计配置是否包含函数或运算表达式
 * @param {string} valueField
 * @returns {boolean}
 */
const hasDiySummaryExpression = valueField => {
  const expression =
    typeof valueField === 'string'
      ? valueField.match(/{{([\s\S]+?)}}/)?.[1]?.trim()
      : ''
  return expression ? !/^(?:列\.)?[\w㐀-鿿（）]+$/.test(expression) : false
}

/**
 * 按字段/表达式和舍入顺序计算自定义合计
 * @param {Object} options
 * @returns {string}
 */
const calculateDiySummary = options => {
  const {
    tableData,
    valueField,
    formatter,
    highPrecisionMapping,
    isRoundFirst,
    renderTemplate
  } = options
  const hasExpression = hasDiySummaryExpression(valueField)

  // 用高精度字段构造公式上下文，不修改实际打印行
  const getHighPrecisionRow = row => {
    const formulaRow = { ...row }
    _.forEach(highPrecisionMapping, (hpField, field) => {
      const value = row._origin?.[hpField] ?? row[hpField]
      if (value !== undefined && value !== null) {
        formulaRow[field] = value
      }
    })
    return formulaRow
  }

  if (!hasExpression) {
    const fieldKey = extractSumField(valueField)
    const mappedField = getHighPrecisionField(fieldKey, highPrecisionMapping)
    const hpField = highPrecisionMapping?.[valueField] || mappedField
    const hasHighPrecisionField = hpField !== fieldKey
    const columnTemplate = valueField.includes('{{')
      ? valueField
      : toSumColTemplate(valueField)
    const sum = _.reduce(
      tableData,
      (total, row, index) => {
        const rawValue = hasHighPrecisionField
          ? row._origin?.[hpField] ?? row[hpField] ?? 0
          : renderTemplate(columnTemplate, index)
        const value =
          isRoundFirst && formatter ? formatter(rawValue).toFixed() : rawValue
        const numericValue = value === '' || isNaN(Number(value)) ? 0 : value
        return total.plus(numericValue)
      },
      Big(0)
    )
    return formatSumWithPrecision(sum, formatter)
  }

  // 表达式最多包含一个 price；后舍入模式下将 price 延迟到合计结果
  const usesPrice = /\bprice\s*\(/.test(valueField)
  let formulaPrecision = 2
  let decimalPlaces = 0
  const deferredPrice = (value, precision = 2) => {
    formulaPrecision = precision
    return value
  }
  const sum = _.reduce(
    tableData,
    (total, row, index) => {
      const renderOptions = isRoundFirst
        ? undefined
        : {
            rowTransform: getHighPrecisionRow,
            priceFn: usesPrice ? deferredPrice : undefined
          }
      const result = String(
        renderTemplate(valueField, index, renderOptions)
      ).trim()
      if (result === '' || isNaN(Number(result))) return total

      const value =
        isRoundFirst && !usesPrice && formatter
          ? formatter(result).toFixed()
          : result
      const decimalPart = String(value).split('.')[1]
      decimalPlaces = Math.max(decimalPlaces, decimalPart?.length || 0)
      return total.plus(value)
    },
    Big(0)
  )

  if (!isRoundFirst && usesPrice) {
    return price(sum, formulaPrecision)
  }
  return usesPrice
    ? sum.toFixed(decimalPlaces)
    : formatSumWithPrecision(sum, formatter)
}

export {
  collectGroups,
  getHeight,
  getWidth,
  pxAdd,
  getStyleWithDiff,
  getBlockName,
  getTableColumnName,
  insertCSS,
  dispatchMsg,
  exchange,
  afterImgAndSvgLoaded,
  getSumTrHeight,
  coverDigit2Uppercase,
  getDataKey,
  isMultiTable,
  getMultiNumber,
  caclSingleDetailsPageHeight,
  getArrayMid,
  getColSpanLength,
  getOverallOrderTrHeight,
  formatSumWithPrecision,
  getHighPrecisionField,
  price,
  extractSumField,
  templateSumResult,
  toSumColTemplate,
  hasDiySummaryExpression,
  calculateDiySummary
}
