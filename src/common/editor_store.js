import i18next from '../../locales'
import { action, computed, observable, set, toJS } from 'mobx'
import { pageTypeMap } from '../config'
import _ from 'lodash'
import { dispatchMsg, getBlockName, exchange, getColSpanLength } from '../util'
import React from 'react'

class EditorStore {
  @observable
  tableCustomStyle = 'default'

  @observable
  emptyTableData = []

  @observable
  config = null

  @observable
  mockData = []

  @observable
  remainPageHeihgt = 0

  // 初始模板
  originConfig = null

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

  // 是否自动行数填充
  @observable
  isAutoFilling = false

  defaultTableDataKey = 'orders'

  // 默认table的dataKey
  setTableDataKeyEffect() {} // 改变dataKey后,做的副作用操作

  defaultTableSubtotal = { show: false }

  @action
  setAutoFillingConfig(bol) {
    this.isAutoFilling = bol
  }

  @observable
  overallOrderShow = false

  // 整单合计自定义合并单元格
  @observable
  overallOrderConfigFields = {
    name: '',
    valueField: '',
    colSpan: 3, // 产品说3个
    style: {
      fontWeight: 'bold'
    }
  }

  // 每页合计自定义合并单元格
  @observable
  subtotalConfigFields = {
    name: '',
    valueField: '',
    colSpan: 6 // 产品说3个,开启自定义单元格,客户不满意，改成6个
  }

  @computed
  get computedPrinterKey() {
    return _.map(this.config, (v, k) => {
      if (k === '__key__' && v) {
        return v
      } else if (k === 'page') {
        return v.type + 'PAGE' + v.printDirection + v.size.width + v.size.height
      } else if (k === 'contents') {
        return _.map(v, vv => {
          if (vv.type === 'table') {
            return (
              'TABLE' +
              vv.columns.length +
              vv.className +
              vv.dataKey +
              vv.subtotal.show +
              vv.summaryConfig?.pageSummaryShow +
              vv.customerRowHeight
            )
          } else {
            return vv.style ? vv.style.height : ''
          }
        }).join('/')
      } else {
        return v.style ? v.style.height : ''
      }
    }).join('_')
  }

  @action.bound
  changeTableCustomStyle(v) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        this.config.contents[arr[2]].className = v
        this.tableCustomStyle = v
      }
    }
  }

  @action.bound
  setRemainPageHeight(remainHeight) {
    this.remainPageHeihgt = remainHeight
  }

  @action
  getFilledTableData(tableData) {
    const { autoFillConfig } = this.config
    if (!this.selectedRegion && !autoFillConfig?.checked) return []
    const tr_count = Math.floor(
      this.remainPageHeihgt / this.computedTableCustomerRowHeight
    )

    const filledData = {
      _isEmptyData: true // 表示是填充的空白数据
    }
    _.map(tableData[0], (val, key) => {
      filledData[key] = ''
    })
    return Array(tr_count).fill(filledData)
  }

  @action.bound
  handleChangeTableData(isAutoFilling = false) {
    const { autoFillConfig } = this.config
    if (!this.selectedRegion && !autoFillConfig?.checked) return
    const dataKey =
      this.computedTableSpecialConfig?.dataKey || autoFillConfig?.dataKey
    const table = this.mockData._table[dataKey]
    this.setAutoFillingConfig(isAutoFilling)

    set(this.config, {
      autoFillConfig: {
        region: this.selectedRegion || autoFillConfig?.region,
        dataKey,
        checked: isAutoFilling
      }
    })

    const hasHadEmptyData = _.some(table, data => data?._isEmptyData)

    // 开关打开，且之前数组不包含空数据，再进行填充
    if (isAutoFilling && !hasHadEmptyData) {
      table.push(...this.getFilledTableData(table))
    }
    if (!isAutoFilling) {
      this.clearExtraTableData(dataKey)
      return
    }
    this.mockData._table[dataKey] = table
  }

  @action
  clearExtraTableData(dataKey) {
    const newTable = this.mockData._table[dataKey].filter(x => !x._isEmptyData)
    this.mockData._table[dataKey] = newTable
  }

  @action
  init(config, data) {
    // batchPrintConfig: 1 不连续打印（一张采购单不出现多供应商）2 连续打印（一张采购单可能出现多个供应商）
    this.config = Object.assign({ batchPrintConfig: 1 }, config)
    this.originConfig = config
    this.selected = null
    this.selectedRegion = null
    this.insertPanel = 'header'
    this.mockData = data
    this.isAutoFilling = false
  }

  @action
  setInsertPanel(panel) {
    this.insertPanel = panel
  }

  @computed
  get computedPanelHeight() {
    return this.config[this.insertPanel].style.height
  }

  @action
  setPanelHeight(height) {
    this.config[this.insertPanel].style.height = height
  }

  @action
  setConfigName(name) {
    this.config.name = name
  }

  @action.bound
  setPageSize(field, value) {
    this.config.page.size[field] = value
  }

  @computed
  get computedIsTime() {
    return (
      _.includes(this.computedSelectedInfo.text, i18next.t('时间')) ||
      _.includes(this.computedSelectedInfo.text, i18next.t('日期'))
    )
  }

  // 可选区域
  @computed
  get computedRegionList() {
    if (!this.config) return []

    const contentRegions = this.config.contents.map((v, i) => {
      if (v.type === 'table') {
        return { value: `contents.table.${i}`, text: i18next.t('区域') + i }
      } else {
        return { value: `contents.panel.${i}`, text: i18next.t('区域') + i }
      }
    })

    return [
      { value: 'all', text: i18next.t('请选择区域') },
      { value: 'header', text: i18next.t('页眉') },
      ...contentRegions,
      { value: 'sign', text: i18next.t('签名') },
      { value: 'footer', text: i18next.t('页脚') }
    ]
  }

  @action
  setConfig(config) {
    this.config = config
  }

  @action
  setPagePrintDirection(value) {
    const { size, printDirection } = this.config.page

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
  setSelected(selected = null) {
    this.selected = selected
  }

  // 选择区域
  @action
  setSelectedRegion(selected) {
    this.selectedRegion = selected
  }

  @action
  setSizePageType(type) {
    const { size, gap, name } = pageTypeMap[type]
    const { contents } = this.config
    // 判断表格是否是三栏表格
    const tableIsMulti3 = _.find(
      contents,
      item => item?.dataKey && item?.dataKey.includes('multi3')
    )
    // 原本是三栏表格，切换到三分纸时，修改dataKey的值
    if (tableIsMulti3 && type === 'A4/3') {
      this.config.contents = _.map(contents, item => {
        if (item?.dataKey && item?.dataKey.includes('multi3')) {
          return { ...item, dataKey: 'orders' }
        }
        return item
      })
    }

    this.config.page = {
      ...this.config.page,
      type,
      size,
      gap,
      name
    }
  }

  @action
  setBatchPrintConfig = type => {
    this.config.batchPrintConfig = type
  }

  // 可选区域做相应的提示
  @computed
  get computedSelectedRegionTip() {
    if (!this.selectedRegion) return ''
    return /(contents)|(sign)/g.test(this.selectedRegion) ? (
      <>
        <div>{i18next.t('说明：所选区域的内容仅打印一次')}</div>
        <div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {i18next.t('开启[三栏商品]打印选项，打印内容可能超出纸张')}
        </div>
      </>
    ) : (
      i18next.t('说明：所选区域的内容每页均打印')
    )
  }

  @computed
  get computedRegionIsTable() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      return arr.includes('table')
    }
  }

  @computed
  get computedIsSelectBlock() {
    if (this.selected) {
      const arr = this.selected.split('.')
      return arr.length === 3 || (arr.length === 5 && arr[3] === 'block')
    }
  }

  @computed
  get computedIsSelectTable() {
    if (this.selected) {
      const arr = this.selected.split('.')
      return arr.length === 5 && arr[3] === 'column'
    }
  }

  @computed
  get computedSelectedSource() {
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
  get computedSelectedInfo() {
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
  setConfigPanelStyle(name, style) {
    const arr = name.split('.')

    if (arr.length === 1) {
      this.config[name].style = style
    } else if (arr.length === 3) {
      this.config.contents[arr[2]].style = style
    }
  }

  @action
  setConfigBlockBy(who, value) {
    if (this.computedIsSelectBlock) {
      const block = this.computedSelectedInfo
      block[who] = value
    }
  }

  @action
  clearAllTableEmptyData() {
    const tableData = this.mockData._table
    for (const [key, table] of Object.entries(tableData)) {
      tableData[key] = table.filter(x => !x._isEmptyData)
    }
    // this.setAutoFillingConfig(false)
    set(this.mockData, {
      _table: tableData
    })
  }

  @action
  addConfigBlock(name, type, pos = {}, link = '') {
    let blocks
    const arr = name.split('.')

    if (arr.length === 1) {
      blocks = this.config[arr[0]].blocks
    } else if (arr.length === 3) {
      blocks = this.config.contents[arr[2]].blocks
    } else {
      return
    }

    switch (type) {
      case '':
      case 'text':
        blocks.push({
          text: i18next.t('请编辑'),
          style: {
            position: 'absolute',
            left: pos.left || '0px',
            top: pos.top || '0px'
          }
        })
        break
      case 'line':
        blocks.push({
          type: 'line',
          style: {
            position: 'absolute',
            left: '0px',
            top: pos.top || '0px',
            borderTopColor: 'black',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            transform: 'rotate(0)',
            transformOrigin: 'left top',
            width: '100%'
          }
        })
        break
      case 'image':
        blocks.push({
          type: 'image',
          link: link,
          style: {
            position: 'absolute',
            left: pos.left || '0px',
            top: pos.top || '0px',
            width: '100px',
            height: '100px'
          }
        })
        break
      case 'counter':
        blocks.push({
          type: 'counter',
          style: {
            left: '0px',
            top: '0px'
          }
        })
        break
      case 'barcode':
        blocks.push({
          type: 'barcode',
          style: {
            left: '0px',
            top: '5px',
            width: '230px'
          },
          text: `{{barcode}}`
        })
        break
      case 'qrcode':
        blocks.push({
          type: 'qrcode',
          style: {
            left: '0px',
            top: '5px',
            width: '75px',
            height: '75px'
          },
          text: `{{qrcode}}`
        })
        break
      case 'uniform_social_credit_code':
        blocks.push({
          type: 'qrcode',
          style: {
            left: '0px',
            top: '5px',
            width: '75px',
            height: '75px'
          },
          text: `{{uniform_social_credit_code}}`
        })
        break
      default:
        window.alert(i18next.t('出错啦，未识别类型，此信息不应该出现'))
    }

    this.selected = getBlockName(name, blocks.length - 1)

    if (!type || type === 'text') {
      // 延迟下 打开textarea
      setTimeout(() => {
        dispatchMsg('gm-printer-block-edit', {
          name: this.selected
        })
      }, 300)
    }
  }

  @action
  setSubtotalShow(name) {
    const arr = name.split('.')
    const table = this.config.contents[arr[2]]
    this.overallOrderShow = !this.overallOrderShow
    // 切换的时候，要把对应table的多余空数据清掉
    this.clearExtraTableData(table.dataKey)

    this.setAutoFillingConfig(!this.isAutoFilling)
    // 获取td的colSpan
    const colSpanLength = getColSpanLength(table)
    set(table.subtotal, {
      show: !table.subtotal.show
    })
    // 兼容存在后端的模板，subtotal配置没有fields
    if (!table.subtotal?.fields) {
      set(table.subtotal, {
        fields: [
          {
            name: '每页合计：',
            valueField: 'real_item_price',
            colSpan: colSpanLength
          }
        ]
      })
    } else {
      table.subtotal.fields[0].colSpan =
        colSpanLength - (table.subtotal.fields?.[1]?.colSpan ?? 0)
    }
  }

  @action
  subtotalRadioCheck(fields) {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      this.config.contents[arr[2]].subtotal.fields[0].valueField = fields.id
    }
  }

  @action
  setOverallOrderShow(name) {
    const arr = name.split('.')
    const table = this.config.contents[arr[2]]
    this.overallOrderShow = !this.overallOrderShow
    const colSpanLength = getColSpanLength(table)
    if (table.overallOrder) {
      set(table.overallOrder, {
        show: !table.overallOrder.show
      })
      table.overallOrder.fields[0].colSpan =
        colSpanLength - (table.overallOrder.fields?.[1]?.colSpan ?? 0)
    } else {
      // 兼容已经存在的配送单据，他们的配置存在后端的，没有overallOrder这个配置，给加上
      set(table, {
        overallOrder: {
          show: true,
          fields: [
            {
              name: '整单合计：',
              valueField: '出库金额',
              style: {
                fontWeight: 'bold'
              },
              colSpan: colSpanLength
            }
          ]
        }
      })
    }
    this.config = toJS(this.config)
  }

  @action
  setConfigTable(who, value) {
    if (!this.computedIsSelectTable) {
      return
    }
    const column = this.computedSelectedInfo
    column[who] = value
  }

  @action
  changeTableDataKey(name, key) {
    const arr = name.split('.')
    const { dataKey, overallOrder, subtotal } = this.config.contents[arr[2]]
    const keyArr = dataKey.split('_')
    let newDataKey
    // 当前有这个key则去掉
    if (keyArr.includes(key)) {
      newDataKey = _.without(keyArr, key)
    } else {
      newDataKey = _.concat(keyArr, key)
    }

    if (newDataKey.includes('multi') && key === 'multi3') {
      newDataKey = _.without(newDataKey, 'multi')
    } else if (newDataKey.includes('multi3') && key === 'multi') {
      newDataKey = _.without(newDataKey, 'multi3')
    }

    newDataKey = _.sortBy(newDataKey, [
      o => o === 'multi3',
      o => o === 'multi',
      o => o === 'category',
      o => o === 'orders'
    ])

    this.config.contents[arr[2]].dataKey = newDataKey.join('_')
    // 整单合计不显示
    if (overallOrder?.show) overallOrder.show = false
    // 每页合计不显示
    if (subtotal?.show) subtotal.show = false
  }

  @action
  setConfigTableBy(name, who, className) {
    const arr = name.split('.')
    this.config.contents[arr[2]][who] = className
  }

  @action
  exchangeTableColumn(target, source) {
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const { columns } = this.config.contents[arr[2]]

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
  exchangeTableColumnByDiff(diff) {
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const { columns } = this.config.contents[arr[2]]

      const source = ~~arr[4]
      const target = source + diff

      if (target >= 0 && target < columns.length) {
        exchange(columns, target, source)

        arr[4] = target
        this.selected = arr.join('.')
      }
    }
  }

  /**
   * 添加字段到Panel
   * @param key
   * @param value
   * @param type block类型
   */
  @action.bound
  addFieldToPanel({ key, value, type }) {
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

    switch (type) {
      case 'image': {
        blocks.push({
          type: 'image',
          text: value,
          style: {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100px',
            height: '100px'
          }
        })
        break
      }

      default: {
        blocks.push({
          text: `${key}：${value}`,
          style: {
            position: 'absolute',
            left: '0px',
            top: '0px'
          }
        })
      }
    }
  }

  /**
   * 添加列到table
   * @param key
   * @param value
   */
  @action.bound
  addFieldToTable({ key, value }) {
    if (this.computedRegionIsTable) {
      const arr = this.selectedRegion.split('.')
      const { columns, dataKey } = this.config.contents[arr[2]]

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

      this.clearExtraTableData(dataKey)
      this.setAutoFillingConfig(false)
    }
  }

  @action.bound
  radioChecked(fields) {
    this.config.specialConfig = fields.id
  }

  @action
  removeField() {
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
  addContentByDiff(name, diff, type) {
    const arr = name.split('.')
    if (arr.length === 3 && arr[0] === 'contents') {
      this.addContent(name, ~~arr[2] + diff, type)
    } else if (arr.length === 5 && arr[3] === 'column') {
      this.addContent(name, ~~arr[2] + diff, type)
    }
  }

  @action.bound
  addContent(name, index, type) {
    const defaultTableDataKey = this.defaultTableDataKey
    const defaultTableSubtotal = this.defaultTableSubtotal

    const arr = name.split('.')
    // 添加之前清除selected,否则content改变之后,computedSelectedSource会计算错误
    this.selected = null
    if ((arr.length === 3 || arr.length === 5) && arr[0] === 'contents') {
      if (index >= 0 && index <= this.config.contents.length) {
        if (type === 'table') {
          this.config.contents.splice(index, 0, {
            type: 'table',
            className: '',
            specialConfig: { style: {} },
            dataKey: defaultTableDataKey, // 默认
            subtotal: defaultTableSubtotal, // 默认的每页合计配置
            columns: [
              {
                head: i18next.t('表头'),
                headStyle: {
                  textAlign: 'center',
                  minWidth: '30px'
                },
                text: i18next.t('内容'),
                style: {
                  textAlign: 'center'
                }
              }
            ]
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

  @action.bound
  setTableDataKey(dataKey) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const table = this.config.contents[arr[2]]

      this.selected = null // 清空点中项
      table.dataKey = dataKey
      // 改变dataKey后做副作用action
      this.setTableDataKeyEffect(table, dataKey)
      this.clearAllTableEmptyData()
    }
  }

  @computed
  get computedTableDataKeyOfSelectedRegion() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        const dataKey = this.config.contents[arr[2]].dataKey
        return dataKey && dataKey.split('_')[0]
      }
    }
  }

  // 获得表格自定义行高
  @computed
  get computedTableCustomerRowHeight() {
    const _defaultRegion = this.config?.autoFillConfig?.region
    let resHeight = 23
    if (this.selectedRegion || _defaultRegion) {
      const _selectedRegion = this.selectedRegion || _defaultRegion
      const arr = _selectedRegion.split('.')
      if (arr.includes('table')) {
        const height = this.config.contents[arr[2]].customerRowHeight
        resHeight = height === undefined ? 23 : height
      }
    }
    return resHeight
  }

  @action.bound
  setTableCustomerRowHeight(val) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        this.config.contents[arr[2]] = {
          ...this.config.contents[arr[2]],
          customerRowHeight: val
        }
        // // 用于触发printer更新最新的剩余高度
        // this.setLineHeight(val)
        this.setAutoFillingConfig(false)
      }
    }
  }

  // 获得双栏表格排列类型
  @computed
  get computedTableArrange() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        return this.config.contents[arr[2]].arrange || 'lateral'
      }
    }
  }

  @action.bound
  setTableArrange(val) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      if (arr.includes('table')) {
        this.config.contents[arr[2]] = {
          ...this.config.contents[arr[2]],
          arrange: val
        }
      }
    }
  }

  @action
  removeContent(name) {
    const arr = name.split('.')
    if (arr[0] === 'contents') {
      // 保留一个
      if (this.config.contents.length > 1) {
        this.config.contents.splice(arr[2], 1)
        this.selected = null
        this.selectedRegion = null
      }
    }
  }

  @action.bound
  setCounter(field, name) {
    const arr = (name && name.split('.')) || []
    const counter = this.config.contents[arr[2]].blocks[arr[4]]
    let { value } = counter

    // 兼容之前版本
    if (value === undefined) {
      value = ['len']
    }

    if (_.includes(value, field)) {
      const index = value.indexOf(field)
      value.splice(index, 1)
    } else {
      value.push(field)
    }
    const height = `${25 * (value.length + 1) + 5}px`
    // 设置counter value
    this.config.contents[arr[2]].blocks[arr[4]] = {
      ...counter,
      value
    }
    this.config.contents[arr[2]].style = { height }
  }

  @computed
  get computedTableSpecialConfig() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const tableConfig = this.config.contents[arr[2]]
      return tableConfig || {}
    } else {
      return {}
    }
  }

  @action.bound
  setSpecialStyle(value) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const tableConfig = this.config.contents[arr[2]]

      const oldStyle = tableConfig.specialConfig
        ? tableConfig.specialConfig.style
        : {}
      set(tableConfig, {
        specialConfig: {
          ...tableConfig.specialConfig,
          style: {
            ...oldStyle,
            ...value
          }
        }
      })
    }
  }

  @action.bound
  setSpecialUpperCase() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const tableConfig = this.config.contents[arr[2]]

      const oldNeedUpperCase = tableConfig.specialConfig
        ? tableConfig.specialConfig.needUpperCase
        : false
      set(tableConfig, {
        specialConfig: {
          ...tableConfig.specialConfig,
          needUpperCase: !oldNeedUpperCase
        }
      })
    }
  }

  @action.bound
  setSubtotalStyle(value) {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const subtotalConfig = this.config.contents[arr[2]].subtotal

      const oldStyle = subtotalConfig.style || {}
      set(subtotalConfig, {
        style: {
          ...oldStyle,
          ...value
        }
      })
    }
  }

  // 每页合计设置大写金额
  @action.bound
  setSubtotalUpperCase() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const subtotalConfig = this.config.contents[arr[2]].subtotal

      const oldNeedUpperCase = subtotalConfig.needUpperCase
      set(subtotalConfig, { needUpperCase: !oldNeedUpperCase })
      // 没有大写金额时，将大写在前和大小写分开的多选框设置为false
      if (subtotalConfig.needUpperCase === false) {
        subtotalConfig.isUpperCaseBefore &&
          set(subtotalConfig, { isUpperCaseBefore: false })
        subtotalConfig.isUpperLowerCaseSeparate &&
          set(subtotalConfig, { isUpperLowerCaseSeparate: false })
      }
    }
  }

  // 每页合计设置大写金额在前
  @action.bound
  setSubtotalUpperCaseBefore() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const subtotalConfig = this.config.contents[arr[2]].subtotal

      const oldUpperCaseBefore = subtotalConfig.isUpperCaseBefore
      set(subtotalConfig, { isUpperCaseBefore: !oldUpperCaseBefore })
    }
  }

  // 每页合计设置大小写金额分开
  @action.bound
  setSubtotalUpperLowerCaseSeparate() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const subtotalConfig = this.config.contents[arr[2]].subtotal

      const oldUpperLowerCaseSeparate = subtotalConfig.isUpperLowerCaseSeparate
      set(subtotalConfig, {
        isUpperLowerCaseSeparate: !oldUpperLowerCaseSeparate
      })
    }
  }

  // 每页合计开启自定义单元格
  @action.bound
  setSubtotalCustomCells() {
    if (this.selectedRegion) {
      // 作用：触发组件的更新
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const table = this.config.contents[arr[2]]
      const subtotalConfig = table?.subtotal
      // 没有显示每页合计的时候不可以设置自定义单元格
      if (!subtotalConfig?.show) return
      // 多栏表格情况，计算colSpan
      const colSpanLength = getColSpanLength(table)
      const oldCustomCells = subtotalConfig?.isCustomCells

      set(subtotalConfig, {
        isCustomCells: !oldCustomCells
      })
      // 兼容已经存在后端的模板，每页合计直接是显示的，导致每页合计配置没有fields,isCustomCells，手动添加上
      if (oldCustomCells === undefined && !subtotalConfig.fields) {
        set(subtotalConfig, {
          fields: [
            {
              name: '每页合计：',
              valueField: 'real_item_price',
              colSpan: colSpanLength
            }
          ]
        })
      }
      // 开启自定义单元格
      if (subtotalConfig?.isCustomCells) {
        // fields添加自定义单元格
        subtotalConfig.fields = [
          subtotalConfig.fields[0],
          {
            ...this.subtotalConfigFields
          }
        ]
        // 重新计算合并单元格的个数
        subtotalConfig.fields[0].colSpan =
          colSpanLength - subtotalConfig.fields[1].colSpan
      } else {
        // 关闭自定义单元格，fields只有一个
        subtotalConfig.fields = [subtotalConfig.fields[0]]
        // 重新计算合并单元格的个数
        subtotalConfig.fields[0].colSpan = colSpanLength
      }
    }
  }

  // 每页合计自定义单元格文本输入
  @action.bound
  setSubtotalFields(value) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const table = this.config.contents[arr[2]]
      const subtotalConfig = table?.subtotal

      if (subtotalConfig.isCustomCells) {
        const subtotalConfig = table?.subtotal.fields
        subtotalConfig[1].name = value
      }
    }
  }

  // 整单合计设置大写金额
  @action.bound
  setOverallOrderUpperCase() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const overallOrderConfig = this.config.contents[arr[2]]?.overallOrder

      const oldNeedUpperCase = overallOrderConfig?.needUpperCase
      this.config.contents[arr[2]]?.overallOrder &&
        set(overallOrderConfig, { needUpperCase: !oldNeedUpperCase })
      // 没有大写金额时，将大写在前和大小写分开的多选框设置为false
      if (
        this.config.contents[arr[2]]?.overallOrder &&
        overallOrderConfig.needUpperCase === false
      ) {
        overallOrderConfig.isUpperCaseBefore &&
          set(overallOrderConfig, { isUpperCaseBefore: false })
        overallOrderConfig.isUpperLowerCaseSeparate &&
          set(overallOrderConfig, { isUpperLowerCaseSeparate: false })
      }
    }
  }

  // 整单合计设置大写金额在前
  @action.bound
  setOverallOrderUpperCaseBefore() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const overallOrderConfig = this.config.contents[arr[2]]?.overallOrder

      const oldUpperCaseBefore = overallOrderConfig?.isUpperCaseBefore
      this.config.contents[arr[2]]?.overallOrder &&
        set(overallOrderConfig, { isUpperCaseBefore: !oldUpperCaseBefore })
    }
  }

  // 整单合计设置大小写金额分开
  @action.bound
  setOverallOrderUpperLowerCaseSeparate() {
    if (this.selectedRegion) {
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const overallOrderConfig = this.config.contents[arr[2]]?.overallOrder

      const oldUpperLowerCaseSeparate =
        overallOrderConfig.isUpperLowerCaseSeparate
      set(overallOrderConfig, {
        isUpperLowerCaseSeparate: !oldUpperLowerCaseSeparate
      })
    }
  }

  // 整单合计开启自定义单元格
  @action.bound
  setOverallOrderCustomCells() {
    if (this.selectedRegion) {
      // 作用：触发tableoverallordertr组件的更新
      this.overallOrderShow = !this.overallOrderShow
      const arr = this.selectedRegion.split('.')
      const table = this.config.contents[arr[2]]
      const overallOrderConfig = table?.overallOrder
      if (!overallOrderConfig || !overallOrderConfig?.show) return
      // 多栏表格情况
      const colSpanLength = getColSpanLength(table)
      const oldCustomCells = overallOrderConfig?.isCustomCells

      set(overallOrderConfig, {
        isCustomCells: !oldCustomCells
      })

      if (overallOrderConfig?.isCustomCells) {
        // fields添加自定义单元格
        overallOrderConfig.fields = [
          overallOrderConfig.fields[0],
          {
            ...this.overallOrderConfigFields,
            // 和之前保持一样的样式
            style: { ...overallOrderConfig.fields[0].style }
          }
        ]
        // 重新计算合并单元格的个数
        overallOrderConfig.fields[0].colSpan =
          colSpanLength - overallOrderConfig.fields[1].colSpan
      } else {
        // 关闭自定义单元格
        overallOrderConfig.fields = [overallOrderConfig.fields[0]]
        // 重新计算合并单元格的个数
        overallOrderConfig.fields[0].colSpan = colSpanLength
      }

      this.config = toJS(this.config)
    }
  }

  // 整单合计自定义单元格文本输入
  @action.bound
  setOverallOrderFields(value) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const table = this.config.contents[arr[2]]
      const overallOrderConfig = table?.overallOrder

      if (overallOrderConfig.isCustomCells) {
        const overallOrderConfigFields = table?.overallOrder.fields
        overallOrderConfigFields[1].name = value
      }
    }
  }

  // 整单合计样式设置
  @action.bound
  setOverallOrderStyle(value) {
    if (this.selectedRegion) {
      const flexStyle = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      }
      const arr = this.selectedRegion.split('.')
      const overallOrderConfigFields = this.config.contents[arr[2]]
        ?.overallOrder.fields
      _.forEach(overallOrderConfigFields, item => {
        const oldStyle = item.style || {}
        set(item, {
          style: {
            ...oldStyle,
            ...value,
            // 整单合计里使用的flex布局，textAlign不生效
            'justify-content': flexStyle[value.textAlign]
          }
        })
      })
    }
  }

  // 合计和每页合计设置交换位置
  @action.bound
  setSubtotalCommutationPlace() {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const subtotalConfig = this.config.contents[arr[2]].subtotal

      const oldCommutationPlace = subtotalConfig.isCommutationPlace
      set(subtotalConfig, { isCommutationPlace: !oldCommutationPlace })
    }
  }

  // 设置是否自动填充空白
  // @action.bound
  // setAutoFillRemainPage(modify) {
  //   if (this.computedRegionIsTable) {
  //     const tableConfig = this.computedTableSpecialConfig
  //     const extraSpecialConfig = tableConfig.extraSpecialConfig
  //     if (extraSpecialConfig) {
  //       set(extraSpecialConfig, modify)
  //     } else {
  //       set(tableConfig, { extraSpecialConfig: { ...modify } })
  //     }
  //   }
  //   // 这么写才会触发子组件的更新
  //   this.config = Object.assign({}, this.config)
  // }

  @action.bound
  setSummaryConfig(modify) {
    if (this.selectedRegion) {
      const arr = this.selectedRegion.split('.')
      const config = this.config.contents[arr[2]]
      const summaryConfig = config.summaryConfig
      if (summaryConfig) {
        set(summaryConfig, modify)
      } else {
        const init = {
          pageSummaryShow: false,
          totalSummaryShow: false,
          style: { textAlign: 'center', fontSize: '12px' },
          summaryColumns: []
        }
        set(config, { summaryConfig: { ...init, ...modify } })
      }
      if ('pageSummaryShow' in modify || 'totalSummaryShow' in modify) {
        // 切换的时候，要把对应table的多余空数据清掉
        this.clearExtraTableData(config.dataKey)
      }
      this.config = toJS(this.config)
    }

    // 如果只是勾选要展示的合计类目的选项，则不需要执行以下操作， 否则会重复清空数据
    if (!('summaryColumns' in modify && 'style' in modify)) {
      this.setAutoFillingConfig(false)
    }
  }
}

export default EditorStore
