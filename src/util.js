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
  origin = origin.replace('px', '')

  return parseInt(~~origin, 10) + add + 'px'
}

function getStyleWithDiff (style, diffX, diffY) {
  const newStyle = Object.assign({}, style)

  console.log(newStyle, diffX)

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

function getBlockName (name, index) {
  return `${name}.block.${index}`
}

function getTableColumnName (name, index) {
  return `${name}.column.${index}`
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

function _fixConfigPanel (panel) {
  panel.blocks = panel.blocks || []
  panel.style = panel.style || {}
}

function _fixConfigTable (table) {
  table.columns = table.columns || []
  if (table.columns.length === 0) {
    table.columns.push({
      head: '表头',
      headStyle: {
        textAlign: 'center'
      },
      text: '内容',
      style: {
        textAlign: 'center'
      }
    })
  }
}

function fixConfig (config) {
  config = _.cloneDeep(config)

  config.page = config.page || {}
  config.page.type = config.page.type || 'A4'

  config.header = config.header || {}
  _fixConfigPanel(config.header)

  config.contents = _.map(config.contents, content => {
    if (content.type === 'table') {
      _fixConfigTable(content)
    } else {
      _fixConfigPanel(content)
    }
  })

  config.sign = config.sign || {}
  _fixConfigPanel(config, 'sign')
  config.footer = config.footer || {}
  _fixConfigPanel(config, 'footer')

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
