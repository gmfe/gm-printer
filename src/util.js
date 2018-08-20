import _ from 'lodash'

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

function getBlockName (panel, index) {
  return `panel.${panel}.block.${index}`
}

function getTableColumnName (index) {
  return `table.column.${index}`
}

function insertCSS (cssString) {
  const style = window.document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(cssString))
  window.document.head.appendChild(style)
}

function dispatchMsg (event, data) {
  window.document.dispatchEvent(new window.CustomEvent(event, {
    detail: data
  }))
}

function exchange (arr, target, source) {
  [arr[target], arr[source]] = [arr[source], arr[target]]
  return arr
}

function _fixConfigPanel (config, panel) {
  config[panel] = config[panel] || {}
  config[panel]['blocks'] = config[panel]['blocks'] || []
  config[panel]['style'] = config[panel]['style'] || {}
}

function fixConfig (config) {
  config = _.cloneDeep(config)

  _fixConfigPanel(config, 'header')
  _fixConfigPanel(config, 'top')
  _fixConfigPanel(config, 'bottom')
  _fixConfigPanel(config, 'sign')
  _fixConfigPanel(config, 'footer')

  config.page = config.page || {}
  config.page.type = config.page.type || 'A4'
  _.each(config.page.blocks, v => {
    v.type = v.type || ''
  })

  config.table = config.table || {}
  config.table.columns = config.table.columns || []
  config.table.className = config.table.className || ''
  config.table.type = config.table.type || ''

  return config
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
  fixConfig
}
