import i18next from '../../locales'
import { action, observable, computed, toJS } from 'mobx'
import {
  getSumTrHeight,
  isMultiTable,
  caclSingleDetailsPageHeight,
  getArrayMid,
  getOverallOrderTrHeight
} from '../util'
import _ from 'lodash'
import Big from 'big.js'

export const TR_BASE_HEIGHT = 23
const price = (n, f = 2) => {
  if (isNaN(n)) return null
  return Big(n || 0).toFixed(f)
}
class PrinterStore {
  @observable ready = false

  // eslint-disable-next-line
  @observable config = {}
  // eslint-disable-next-line
  @observable pageHeight = {}
  // eslint-disable-next-line
  @observable height = {}

  @observable contents = []
  // eslint-disable-next-line
  @observable tablesInfo = {}

  @observable pages = [] // [{type, index, begin, end}]

  /** 当前页剩余空白高度 */
  @observable remainPageHeight = 0

  data = {}

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  // 选择中区域
  @observable
  selectedRegion = null

  // 是否自动行数填充
  @observable
  isAutoFilling = false

  // 是否自动行数填充
  @observable
  fillRowValue = 0

  // 是否自动行数填充
  @observable
  fillIndex = 0

  /** 是否开启多位小数，默认不开启，取两位 */
  @observable
  isMultiDigitDecimal = false

  @action
  setMultiDigitDecimal(bool) {
    this.isMultiDigitDecimal = bool
  }

  @action
  init(config, data) {
    this.ready = false
    this.config = config
    this.height = {}
    this.contents = []
    this.tablesInfo = {}
    this.pages = [] // [page, page, ...] page 为数组
    this.data = data
    this.selected = null
  }

  @action
  setAutofillConfig(bol) {
    this.isAutoFilling = bol
    if (!bol) {
      this.pages = []
      this.fillIndex = false
      this.fillRowValue = 0
    }
  }

  @action
  setFillRowValue(value) {
    this.fillRowValue = value
  }

  @action
  setFillIndex(value) {
    this.fillIndex = value
  }

  @action
  setData(data) {
    this.data = data
  }

  @action
  setPageHeight(height) {
    this.pageHeight = height
  }

  @action
  setHeight(who, height) {
    this.height[who] = height
  }

  @action
  setTable(name, table) {
    this.tablesInfo[name] = table
  }

  @action
  setReady(ready) {
    this.ready = ready
  }

  get tableConfig() {
    const { autoFillConfig } = this.config
    if (!this.selectedRegion && !autoFillConfig?.checked) return null
    const _selectedRegion = this.selectedRegion || autoFillConfig.region || ''
    const arr = _selectedRegion.split('.')
    const tableConfig = this.config.contents[arr[2]]

    if (!_.has(tableConfig, 'dataKey')) return null
    return tableConfig
  }

  @computed
  get tableData() {
    if (!this.tableConfig) return []
    const { autoFillConfig } = this.config
    const { dataKey } = this.tableConfig
    if (autoFillConfig?.region) {
      /** 当前数据 */
      return this.data._table[dataKey] || []
    }
    if (!this.selectedRegion) return []

    /** 当前数据 */
    return this.data._table[dataKey] || []
  }

  @computed // 空数据的长度
  get filledTableLen() {
    const filledData = this.tableData.filter(x => x._isEmptyData)
    return filledData.length
  }

  // 获得表格自定义行高
  @computed
  get computedTableCustomerRowHeight() {
    const _defaultRegion = this.config?.autoFillConfig?.region
    if (this.selectedRegion || _defaultRegion) {
      const _selectedRegion = this.selectedRegion || _defaultRegion
      const arr = _selectedRegion.split('.')
      if (arr.includes('table')) {
        const height = this.config.contents[arr[2]]?.customerRowHeight
        return [undefined, ''].includes(height) ? 23 : height
      }
    }
    return 23
  }

  @action
  setSelected(selected) {
    this.selected = selected || null
  }

  @action
  setSelectedRegion(selected) {
    this.selectedRegion = selected || null
  }

  getNormalTableBodyHeights(heights, dataKey) {
    if (!this.tableConfig) return heights
    const len = this.tableData.length
    // 如果是已经开了填充配置，回显的heights包括了填充的表格部分，关闭配置时，这种情况就要去掉填充的
    if (_.gt(heights.length, len)) return heights.slice(0, len)
    const hasEmptyData = this.tableData.some(x => x._isEmptyData)
    const isOrderCategroy = dataKey === this.config?.autoFillConfig?.dataKey
    const { customerRowHeight = TR_BASE_HEIGHT } = this.tableConfig
    if (hasEmptyData && !this.isAutoFilling && isOrderCategroy) {
      // 如果tableData有填充的空数据， 则去掉
      return heights.slice(0, -this.filledTableLen)
    } else if (this.isAutoFilling && isOrderCategroy) {
      // 如果没有空数据，且isAutofilling是true,即选择了要填充数据
      return [
        ...heights,
        ...Array(this.filledTableLen).fill(_.toNumber(customerRowHeight))
      ]
    } else {
      // 正常情况
      return heights
    }
  }

  @action
  setOverallOrder(config) {
    this.config = config || {}
  }

  /** 处理采购单的明细
      一行有多个明细, 并且采购明细是换行展示, 明细数据超多的情况则需要分割到不同页面中
      比如： 一行有20行明细，当前页只能放下17行明细 ,剩下的3行明细需要放到下一页进行展示 */
  @action
  computedData(dataKey, table, end, currentRemainTableHeight) {
    /** 当前数据 */
    const tableData = this.data._table[dataKey] || []
    let count = 0
    _.forEach(Array(end).fill(1), (val, i) => {
      const details = tableData[i]?.__details || []
      // 双栏---获取第二列的数据
      const detailsMulti = tableData[i]?.__details_MULTI_SUFFIX || []
      count = details.length + detailsMulti.length + count
    })

    /** 明细data */
    const detailsData = tableData[end]?.__details
    // 双栏明细data
    const detailsDataMulti = tableData[end]?.__details_MULTI_SUFFIX
    // 采购单如果使用双栏，取明细最多的那个数据
    const data =
      detailsData?.length > (detailsDataMulti?.length || 0)
        ? detailsData
        : detailsDataMulti
    // 如果没有details 和 明细不换行, 就不用计算了
    if (!data || dataKey.includes('noLineBreak')) {
      return []
    }
    // 获取当前行的所有明细的高度集
    const detailsHeights = table.body.children.slice(count, count + data.length)

    const { ranges, detailsPageHeight } = caclSingleDetailsPageHeight(
      detailsHeights,
      currentRemainTableHeight
    )

    // 分局明细拆分后的数据
    const splitTableData = _.map(
      _.filter(ranges, i => i[0] !== i[1]), // 过滤掉 {[0,3],[3,3]}这周情况
      range => {
        const _tableData = Object.assign({}, tableData[end])
        _tableData.__details = data.slice(...range)
        // 双栏中的数据也要做处理
        if (isMultiTable(dataKey)) {
          _tableData.__details_MULTI_SUFFIX = data.slice(...range)
        }

        return _tableData
      }
    )
    // 插入原table数据中
    tableData.splice(end, 1, ...splitTableData)
    this.data._table[dataKey] = tableData
    return detailsPageHeight
  }

  @action
  computedPages() {
    // 每次先初始化置空
    this.pages = []
    // 每页必有 页眉header, 页脚footer , 签名
    const allPagesHaveThisHeight = this.height.header + this.height.footer
    // 退出计算! 因为页眉 + 页脚 > currentPageHeight,页面装不下其他东西
    if (allPagesHaveThisHeight > this.pageHeight) {
      return
    }

    /** 某一page的累积已填充的高度 */
    let currentPageHeight = allPagesHaveThisHeight
    // 当前在处理 contents 的索引
    let index = 0
    /** 一页承载的内容. [object, object, ...] */
    let page = []
    /** 处理配送单有多个表格的情况 */
    let tableCount = 0
    /* --- 遍历 contents,将内容动态分配到page --- */
    while (index < this.config.contents.length) {
      const content = this.config.contents[index]

      /* 表格内容处理 */
      if (content.type === 'table') {
        // 是表格就++
        tableCount++
        // 表格原始的高度和宽度信息
        const table = this.tablesInfo[`contents.table.${index}`]
        const { subtotal, dataKey, summaryConfig, overallOrder } = content
        // 如果显示每页合计,那么table高度多预留一行高度
        const subtotalTrHeight = subtotal.show ? getSumTrHeight(subtotal) : 0
        // 如果显示整单合计,那么table高度多预留一行高度
        const overallOrderTrHeight = overallOrder?.show
          ? getOverallOrderTrHeight(overallOrder)
          : 0
        // 如果每页合计(新的),那么table高度多预留一行高度
        const pageSummaryTrHeight =
          summaryConfig?.pageSummaryShow && !isMultiTable(dataKey) // 双栏table没有每页合计
            ? getSumTrHeight(summaryConfig)
            : 0
        // 每个表格都具有的高度
        const allTableHaveThisHeight =
          table.head.height +
          subtotalTrHeight +
          pageSummaryTrHeight +
          overallOrderTrHeight
        /** 当前page页面的最小高度 */
        const currentPageMinimumHeight =
          allPagesHaveThisHeight + allTableHaveThisHeight
        /** 当前page可容纳的table高度 */
        let pageAccomodateTableHeight = +new Big(this.pageHeight)
          .minus(currentPageHeight)
          .toFixed(2)
        const heights = this.getNormalTableBodyHeights(
          table.body.heights,
          dataKey
        )
        // 表格行的索引,用于table.slice(begin, end), 分割到不同页面中
        let begin = 0
        let end = 0
        // 如果表格没有数据,那么轮一下个content
        if (heights.length === 0) {
          index++
        } else {
          /** 仅计算当前页table的累积高度 */
          let currentTableHeight = allTableHaveThisHeight
          // 表格有数据,添加[每个表格都具有的高度]
          currentPageHeight += allTableHaveThisHeight
          /** 当前table剩余的高度 */
          let currentRemainTableHeight = 0
          /** 去最小的tr高度，用于下面的计算compare,(避免特殊情况：一般来说最小tr——height = 23, 比23还小的不考虑计算) */
          const minHeight = Math.max(getArrayMid(heights), 23)
          /* 遍历表格每一行，填充表格内容 */
          while (end < heights.length) {
            currentTableHeight += heights[end]
            // 用于计算最后一页有footer情况的高度
            currentPageHeight += heights[end]
            // 当前页没有多余空间
            if (currentTableHeight > pageAccomodateTableHeight) {
              currentRemainTableHeight = +Big(pageAccomodateTableHeight)
                .minus(currentTableHeight)
                .plus(heights[end])

              /**
               * 说明： 1. currentRemainTableHeight至少要是minHeight的 2倍，不然每次到这都进入if，同时留下一点空白距离
               * 2. heights[end]至少要是currentRemainTableHeight的 1倍，怕出现打印时最后一行文字显示一半的情况
               * 3. heights[end] 高度超过了 pageAccomodateTableHeight
               */
              if (
                (currentRemainTableHeight / minHeight > 1.5 &&
                  heights[end] / currentRemainTableHeight > 1) ||
                heights[end] > pageAccomodateTableHeight
              ) {
                const detailsPageHeight = this.computedData(
                  dataKey,
                  table,
                  end,
                  currentRemainTableHeight
                )

                // 拆分明细后，同时也要更新body.heights 不能影响后续计算
                if (detailsPageHeight.length > 0) {
                  // 比较剩余高度和minHeight的大小，取最大（防止剩余一条明细时，第二页撑开的高度远大于一条明细的高度）
                  detailsPageHeight[1] = Math.max(
                    minHeight,
                    detailsPageHeight[1]
                  )
                  heights.splice(end, 1, ...detailsPageHeight)
                  end++
                }
              }
              // 第一条极端会有问题
              if (end !== 0) {
                page.push({
                  type: 'table',
                  index,
                  begin,
                  end
                })
                // 此页完成任务
                this.pages.push(page)
                page = []
              }
              // 页面有多个表格时，当同一页的第二个表格的第一行高度加上第一个表格的高度大于页面的高度，需要生成新的一页
              // 因为是第二个表格，重新走了遍历，end重置0，没有进入到上面的判断（end !== 0），不会生成新的一页
              if (tableCount > 1 && end === 0) {
                this.pages.push(page)
                page = []
              }

              begin = end
              // 开启新一页,重置页面高度
              pageAccomodateTableHeight = +new Big(this.pageHeight).minus(
                allPagesHaveThisHeight
              )
              currentTableHeight = allTableHaveThisHeight
              currentPageHeight = currentPageMinimumHeight
            } else {
              // 有空间，继续做下行
              end++
              // 最后一行，把信息加入 page，并轮下一个contents
              if (end === heights.length) {
                page.push({
                  type: 'table',
                  index,
                  begin,
                  end
                })
                index++
              }
            }
          }
        }
        /* 非表格内容处理 */
      } else {
        const panelHeight = this.height[`contents.panel.${index}`]
        currentPageHeight += panelHeight

        // 当 panel + allPagesHaveThisHeight > 页高度, 停止. 避免死循环
        if (panelHeight + allPagesHaveThisHeight > this.pageHeight) {
          break
        }

        // 如果是最后一页，必须要加上sign的高度，否则会重叠
        if (index === this.config.contents.length - 1) {
          currentPageHeight += this.height?.sign
        }

        if (currentPageHeight <= this.pageHeight) {
          // 空间充足，把信息加入 page，并轮下一个contents
          page.push({
            type: 'panel',
            index
          })

          index++
        } else {
          // 此页空间不足，此页完成任务
          this.pages.push(page)

          // 为下一页做准备
          page = []
          currentPageHeight = allPagesHaveThisHeight
        }
      }
    }
    this.pages.push(page)
    this.remainPageHeight = +Big(this.pageHeight - currentPageHeight).toFixed(0)
  }

  @action
  financeComputedPages() {
    // 当前在处理 contents 的索引
    let index = 0
    /** 一页承载的内容. [object, object, ...] */
    let page = []
    const pageFixLineNum = this.config.financeSpecialConfig.pageFixLineNum
    while (index < this.config.contents.length) {
      const content = this.config.contents[index]

      const table = this.tablesInfo[`contents.table.${index}`]
      // 表格行的索引,用于table.slice(begin, end), 分割到不同页面中
      let begin = 0
      let end = 0

      if (content.type === 'table') {
        while (end < table.body.heights.length) {
          end += pageFixLineNum
          page.push({
            type: 'table',
            index,
            begin,
            end
          })
          this.pages.push(page)
          page = []
          begin = end
        }
        index++
      } else {
        page.push({
          type: 'panel',
          index
        })
        index++
      }
    }
    // this.pages.push(page)
  }

  template(text, pageIndex) {
    // 做好保护，出错就返回 text
    try {
      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data.common,
        [i18next.t('当前页码')]: pageIndex + 1,
        [i18next.t('页码总数')]: this.pages.length,
        price: price
      })
    } catch (err) {
      return text
    }
  }

  templateTable(text, dataKey, index, pageIndex) {
    // 做好保护，出错就返回 text
    try {
      let list = this.data._table[dataKey] || this.data._table.orders

      // 采购任务打印存在两个表格，第二表格没有明细，数据需要做去重
      if (dataKey === 'purchase_no_detail') {
        list = _.uniqBy(list, '序号')
      }

      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data.common,

        [i18next.t('列')]: list[index],
        [i18next.t('当前页码')]: pageIndex + 1,
        [i18next.t('页码总数')]: this.pages.length,
        price: price // 提供一个价格处理函数
      })
    } catch (err) {
      return text
    }
  }

  /**
   * 配送单的定制化需求:限制表格里的字的个数,超出显示'...'
   */
  templateFinance(text, dataKey, index, pageIndex) {
    // 做好保护，出错就返回 text
    try {
      const list = this.data._table[dataKey] || this.data._table.orders

      let res = _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data.common,
        [i18next.t('列')]: list[index],
        [i18next.t('当前页码')]: pageIndex + 1,
        [i18next.t('页码总数')]: this.pages.length,
        price: price // 提供一个价格处理函数
      })
      res =
        text === '{{列.商品名}}' && res.length > 5
          ? `${res.slice(0, 5)}...`
          : res
      return res
    } catch (err) {
      return text
    }
  }

  templateSpecialDetails(col, dataKey, index) {
    // 做好保护，出错就返回 text
    const { specialDetailsKey, text, detailLastColType, separator } = col
    try {
      const row = this.data._table[dataKey][index]
      const compiled = _.template(text, { interpolate: /{{([\s\S]+?)}}/g })
      let detailsList = row[specialDetailsKey] || []

      /** 简单处理下数据 */
      const filterList = (list, type = '') => {
        if (type === 'noLineBreak') {
          const details = list.map(d => `${compiled(d)}`).join(separator)

          return `<div class='b-table-details'>${details}</div>`
        }
        return list
          .map(d => `<div class='b-table-details'> ${compiled(d)} </div>`)
          .join('')
      }

      /** 明细换行和不换行处理 */
      detailsList =
        !detailLastColType || detailLastColType === 'purchase_last_col'
          ? filterList(detailsList)
          : filterList(detailsList, 'noLineBreak')

      return detailsList
    } catch (err) {
      return text
    }
  }

  // 用于初始化的计算
  getFilledTableData(tableData) {
    const { autoFillConfig } = this.config
    if (!this.selectedRegion && !autoFillConfig?.checked) return []
    let tr_count = 0
    if (this.fillRowValue === 0) {
      tr_count = Math.floor(
        this.remainPageHeight / this.computedTableCustomerRowHeight
      )
    } else {
      tr_count = this.fillRowValue
    }
    const filledData = {
      _isEmptyData: true // 表示是填充的空白数据
    }
    _.map(tableData[0], (val, key) => {
      filledData[key] = ''
    })

    return Array(tr_count).fill(filledData)
  }

  @action.bound
  changeTableData() {
    const { autoFillConfig } = this.config
    if (!this.isAutoFilling) return
    const dataKey = autoFillConfig?.dataKey
    const table = this.data._table[dataKey]?.filter(item => !item._isEmptyData)

    const lastKey = _.findLast(table, item => item?.序号)?.序号 + 1
    console.log(lastKey, 'lastKey=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
    const fillList = _.map(this.getFilledTableData(table), (item, index) => {
      if (this.fillIndex) {
        return { ...item, 序号: index + lastKey }
      } else {
        return { ...item }
      }
    })
    table.push(...fillList)
    this.data._table[dataKey] = table
  }

  @action.bound
  resetTableData() {
    const { autoFillConfig } = this.config
    if (!this.isAutoFilling) return
    const dataKey = autoFillConfig?.dataKey
    const table = this.data._table[dataKey]?.filter(item => !item._isEmptyData)
    const restTable = _.map(table, item => {
      return { ...item }
    })
    this.data._table[dataKey] = restTable
  }
}

export default PrinterStore
