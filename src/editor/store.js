import { action, computed, configure, observable } from 'mobx'
import { pageTypeMap } from '../config'
import _ from 'lodash'
import { dispatchMsg, getBlockName } from '../util'

configure({enforceActions: 'observed'})

class EditStore {
  @observable
  config = null

  // 一个能唯一标识某个东西的字符串
  // header
  // header.block.1
  // contents.panel.1.block.1
  // contents.table.2.column.1
  @observable
  selected = null

  /* 选择中区域, 区域唯一标识字符串
     header
     footer
     sign
     contents.panel.n
     contents.table.n
   */
  @observable
  selectedRegion = null

  @observable
  insertPanel = 'header'

  @observable
  _cacheConfig = []

  @observable
  hasUndo = false

  @observable
  hasRedo = false

  @computed
  get computedPrinterKey () {
    return _.map(this.config, (v, k) => {
      if (k === 'page') {
        return v.type + '_' + v.printDirection + '_' + v.size.width + '-' + v.size.height
      } else if (k === 'counter') {
        return 'counter' + v.show
      } else if (k === 'contents') {
        return _.map(v, vv => {
          if (vv.type === 'table') {
            return vv.columns.length + '_' + vv.className + '_' + vv.dataKey + '_' + vv.subtotal.show
          } else {
            return vv.style ? vv.style.height : ''
          }
        }).join('_')
      } else {
        return v.style ? v.style.height : ''
      }
    }).join('_')
  }

  @action
  setInsertPanel (panel) {
    this.insertPanel = panel
  }

  @computed
  get computedPanelHeight () {
    return this.config[this.insertPanel].style.height
  }

  @action
  setPanelHeight (height) {
    this.config[this.insertPanel].style.height = height
  }

  @action
  init (config) {
    this.config = config
    this.selected = null
    this.selectedRegion = null
    this.insertPanel = 'header'
  }

  @action
  setConfigName (name) {
    this.config.name = name
  }

  @action
  setPageSize (field, value) {
    this.config.page.size[field] = value
  }

  @action
  setPagePrintDirection (value) {
    let {size, printDirection} = this.config.page

    // 打印方向切换了, 宽高互换
    if (value !== printDirection) {
      this.config.page = {
        ...this.config.page,
        printDirection: value,
        size: {
          width: size.height,
          height: size.width
        }
      }
    }
  }

  @action
  setCounterShow (bool) {
    this.config.counter.show = bool
  }

  @action
  setConfig (config) {
    this.config = config
  }

  @action
  setSizePageType (type) {
    const {size, gap, name} = pageTypeMap[type]

    this.config.page = {
      ...this.config.page,
      type,
      size,
      gap,
      name
    }
  }

  @action
  setSelected (selected = null) {
    this.selected = selected
  }

  // 选择区域
  @action
  setSelectedRegion (selected) {
    console.log(selected)
    this.selectedRegion = selected
  }

  // 可选区域
  @computed
  get computedRegionList () {
    if (!this.config) return []

    const contentRegions = this.config.contents.map((v, i) => {
      if (v.type === 'table') {
        return {value: `contents.table.${i}`, text: `区域${i}`}
      } else {
        return {value: `contents.panel.${i}`, text: `区域${i}`}
      }
    })

    return [
      {value: 'all', text: '请选择区域'},
      {value: 'header', text: '页眉'},
      ...contentRegions,
      {value: 'sign', text: '签名'},
      {value: 'footer', text: '页脚'}
    ]
  }

  @computed
  get computedRegionIsTable () {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      return arr.includes('table')
    }
  }

  @computed
  get computedIsSelectBlock () {
    if (this.selected) {
      const arr = this.selected.split('.')
      return arr.length === 3 || (arr.length === 5 && arr[3] === 'block')
    }
  }

  @computed
  get computedIsSelectTable () {
    if (this.selected) {
      const arr = this.selected.split('.')
      return arr.length === 5 && arr[3] === 'column'
    }
  }

  @computed
  get computedSelectedSource () {
    if (!this.selected) {
      return null
    }

    const arr = this.selected.split('.')
    if (arr.length === 3) {
      return this.config[arr[0]].blocks
    } else if (arr.length === 5 && arr[3] === 'block') {
      return this.config.contents[arr[2]].blocks
    } else if (arr.length === 5 && arr[3] === 'column') {
      return this.config.contents[arr[2]].columns
    }
  }

  @computed
  get computedSelectedInfo () {
    if (!this.selected) {
      return null
    }

    const source = this.computedSelectedSource

    const arr = this.selected.split('.')
    if (arr.length === 3) {
      return source[arr[2]]
    } else if (arr.length === 5 && arr[3] === 'block') {
      return source[arr[4]]
    } else if (arr.length === 5 && arr[3] === 'column') {
      return source[arr[4]]
    }
  }

  @action
  setConfigPanelStyle (name, style) {
    const arr = name.split('.')

    if (arr.length === 1) {
      this.config[name].style = style
    } else if (arr.length === 3) {
      this.config.contents[arr[2]].style = style
    }
  }

  @action
  setConfigBlockBy (who, value) {
    console.log(1)
    if (this.computedIsSelectBlock) {
      const block = this.computedSelectedInfo
      block[who] = value
    }
  }

  @action
  addConfigBlock (name, type, pos = {}) {
    let blocks
    const arr = name.split('.')

    if (arr.length === 1) {
      blocks = this.config[arr[0]].blocks
    } else if (arr.length === 3) {
      blocks = this.config.contents[arr[2]].blocks
    } else {
      return
    }

    if (!type || type === 'text') {
      blocks.push({
        text: '请编辑',
        style: {
          position: 'absolute',
          left: pos.left || '0px',
          top: pos.top || '0px'
        }
      })
    } else if (type === 'line') {
      blocks.push({
        type: 'line',
        style: {
          position: 'absolute',
          left: '0px',
          top: pos.top || '0px',
          borderTopColor: 'black',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          width: '100%'
        }
      })
    } else if (type === 'image') {
      blocks.push({
        type: 'image',
        link: '',
        style: {
          position: 'absolute',
          left: pos.left || '0px',
          top: pos.top || '0px',
          width: '100px',
          height: '100px'
        }
      })
    } else {
      window.alert('出错啦，未识别类型，此信息不应该出现')
    }

    this.selected = getBlockName(name, blocks.length - 1)

    if (!type || type === 'text') {
      // 延迟下 打开textarea
      setTimeout(() => {
        dispatchMsg('gm-printer-block-edit', {
          name: this.selected
        })
      }, 200)
    }
  }

  @action
  setSubtotalShow (name) {
    const arr = name.split('.')
    const table = this.config.contents[arr[2]]
    table.subtotal.show = !table.subtotal.show
  }

  @action
  setConfigTable (who, value) {
    if (!this.computedIsSelectTable) {
      return
    }

    const column = this.computedSelectedInfo
    column[who] = value
  }

  @action
  changeTableDataKey (name, key) {
    const arr = name.split('.')
    const {dataKey} = this.config.contents[arr[2]]
    const keyArr = dataKey.split('_')
    let newDataKey
    // 当前有这个key则去掉
    if (keyArr.includes(key)) {
      newDataKey = _.without(keyArr, key)
    } else {
      newDataKey = _.concat(keyArr, key)
    }

    newDataKey = _.sortBy(newDataKey, [o => o === 'multi', o => o === 'category', o => o === 'orders'])

    this.config.contents[arr[2]].dataKey = newDataKey.join('_')
  }

  @action
  setConfigTableBy (name, who, className) {
    const arr = name.split('.')
    this.config.contents[arr[2]][who] = className
  }

  @action
  exchangeTableColumn (target, source) {
    console.log(target, source)
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const {columns} = this.config.contents[arr[2]]

      if (target >= 0 && target < columns.length) {
        // 选中列插入到目标列前面
        const sourceEle = columns.splice(source, 1)[0]
        const insertIndex = target > source ? target - 1 : target
        columns.splice(insertIndex, 0, sourceEle)

        arr[4] = insertIndex
        this.selected = arr.join('.')
      }
    }
  }

  @action
  exchangeTableColumnByDiff (diff) {
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const source = ~~arr[4]
      this.exchangeTableColumn(source + diff, source)
    }
  }

  /**
   * 添加字段到Panel
   * @param key
   * @param value
   */
  @action.bound
  addFieldToPanel ({key, value}) {
    if (!this.selectedRegion) return
    const arr = this.selectedRegion.split('.')
    let blocks
    // 在header,footer,sign
    if (arr.length === 1) {
      blocks = this.config[arr[0]].blocks
      // contents 里面
    } else if (arr.length === 3) {
      blocks = this.config.contents[arr[2]].blocks
    }

    blocks.push({
      text: `${key}: ${value}`,
      style: {
        position: 'absolute',
        left: '0px',
        top: '0px'
      }
    })
  }

  /**
   * 添加列到table
   * @param key
   * @param value
   */
  @action.bound
  addFieldToTable ({key, value}) {
    if (this.computedRegionIsTable) {
      const arr = this.selectedRegion.split('.')
      const {columns} = this.config.contents[arr[2]]

      columns.push({
        head: key,
        headStyle: {
          textAlign: 'center'
        },
        text: value,
        style: {
          textAlign: 'center'
        }
      })
    }
  }

  @action
  removeField () {
    if (!this.selected) {
      return
    }

    const source = this.computedSelectedSource
    const arr = this.selected.split('.')

    if (arr.length === 3) {
      source.splice(arr[2], 1)
    } else if (arr.length === 5 && arr[1] === 'panel') {
      source.splice(arr[4], 1)
    } else if (arr.length === 5 && arr[1] === 'table') {
      // 表格至少保留一列
      if (source.length > 1) {
        source.splice(arr[4], 1)
      }
    }

    this.selected = null
  }

  @action
  addContentByDiff (name, diff, type) {
    const arr = name.split('.')
    if (arr.length === 3 && arr[0] === 'contents') {
      this.addContent(name, ~~arr[2] + diff, type)
    } else if (arr.length === 5 && arr[3] === 'column') {
      this.addContent(name, ~~arr[2] + diff, type)
    }
  }

  @action
  addContent (name, index, type) {
    const arr = name.split('.')
    // 添加之前清除selected,否则content改变之后,computedSelectedSource会计算错误
    this.selected = null
    if ((arr.length === 3 || arr.length === 5) && arr[0] === 'contents') {
      if (index >= 0 && index <= this.config.contents.length) {
        if (type === 'table') {
          this.config.contents.splice(index, 0, {
            type: 'table',
            dataKey: 'orders',
            subtotal: {
              show: false
            },
            columns: [{
              head: '表头',
              headStyle: {
                textAlign: 'center'
              },
              text: '内容',
              style: {
                textAlign: 'center'
              }
            }]
          })
        } else {
          this.config.contents.splice(index, 0, {
            blocks: [],
            style: {
              height: '100px'
            }
          })
        }
      }
    }
  }

  @action
  setTableDataKey (dataKey) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      this.config.contents[arr[2]].dataKey = dataKey
    }
  }

  @computed
  get computedTableDataKeyOfSelectedRegion () {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        const dataKey = this.config.contents[arr[2]].dataKey
        return dataKey.split('_')[0]
      }
    }
  }

  @action
  removeContent (name) {
    const arr = name.split('.')
    if (arr[0] === 'contents') {
      // 保留一个
      if (this.config.contents.length > 1) {
        this.config.contents.splice(arr[2], 1)
        this.selected = null
      }
    }
  }
}

export default new EditStore()
