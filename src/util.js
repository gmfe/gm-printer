function getHeight (el) {
  const styles = window.getComputedStyle(el)
  const height = el.offsetHeight
  const borderTopWidth = parseFloat(styles.borderTopWidth)
  const borderBottomWidth = parseFloat(styles.borderBottomWidth)
  const paddingTop = parseFloat(styles.paddingTop)
  const paddingBottom = parseFloat(styles.paddingBottom)
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom
}

function getWidth (el) {
  const styles = window.getComputedStyle(el)
  const width = el.offsetWidth
  const borderLeftWidth = parseFloat(styles.borderLeftWidth)
  const borderRightWidth = parseFloat(styles.borderRightWidth)
  const paddingLeft = parseFloat(styles.paddingLeft)
  const paddingRight = parseFloat(styles.paddingRight)
  return width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight
}

const pageSizeMap = {
  'A4': {
    size: {
      width: '210mm',
      height: '297mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  'A5': {
    size: {
      width: '180mm',
      height: '260mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  },
  '自定义': {
    size: {
      width: '210mm',
      height: '150mm'
    },
    gap: {
      paddingTop: '5mm',
      paddingRight: '5mm',
      paddingBottom: '5mm',
      paddingLeft: '5mm'
    }
  }
}

function pxAdd (origin, add) {
  return parseFloat(origin, 10) + add + 'px'
}

function getStyleWithDiff (style, diffX, diffY) {
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

function getBlockName (pageIndex, panel, index) {
  return `page.${pageIndex}.${panel}.block.${index}`
}

function insertCSS (cssString) {
  const style = window.document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(cssString))
  window.document.head.appendChild(style)
}

const fontSizeList = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px'
]

const borderStyleList = [
  {value: 'solid', text: '实线'},
  {value: 'dashed', text: '虚线'},
  {value: 'dotted', text: '圆点'}
]

const tableStyleList = [
  {value: 'gm-printer-table-style-1', text: '样式一'},
  {value: 'gm-printer-table-style-2', text: '样式二'},
  {value: 'gm-printer-table-style-3', text: '样式三'}
]

const panelList = [
  {value: 'header', text: '页眉'},
  {value: 'top', text: '页头'},
  {value: 'bottom', text: '页尾'},
  {value: 'footer', text: '页脚'}
]

const blockTypeList = [
  {value: '', text: '文本'},
  {value: 'line', text: '线条'},
  {value: 'image', text: '图片'}
]

export {
  fontSizeList,
  borderStyleList,
  tableStyleList,
  panelList,
  blockTypeList,
  getHeight,
  getWidth,
  pageSizeMap,
  pxAdd,
  getStyleWithDiff,
  getBlockName,
  insertCSS
}
