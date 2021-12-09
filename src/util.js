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

  right = right.replace(/(零分)/, '整').replace(/(零角整)/, '') || '整'

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

// 是不是双栏table
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

export {
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
  getArrayMid
}
