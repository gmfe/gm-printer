import i18next from '../../locales'
import { action, observable } from 'mobx'
import {
  getSumTrHeight,
  isMultiTable,
  caclSingleDetailsPageHeight,
  getArrayMid
} from '../util'
import _ from 'lodash'
import Big from 'big.js'

const price = (n, f = 2) => Big(n || 0).toFixed(f)
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

  data = {}

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  // 选择中区域
  @observable
  selectedRegion = null

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

  @action
  setSelected(selected) {
    this.selected = selected || null
  }

  @action
  setSelectedRegion(selected) {
    this.selectedRegion = selected || null
  }

  @action
  computedData(dataKey, table, end, currentRemainTableHeight) {
    /** 当前数据 */
    const tableData = this.data._table[dataKey] || []
    /** 明细data */
    const detailsData = tableData[end]?.__details || []
    const { ranges, detailsPageHeight } = caclSingleDetailsPageHeight(
      table,
      detailsData,
      currentRemainTableHeight
    )

    // 分局明细拆分后的数据
    const splitTableData = _.map(ranges, range => {
      const _tableData = Object.assign({}, tableData[end])
      _tableData.__details = detailsData.slice(...range)
      return _tableData
    })

    // 插入原table数据中
    tableData.splice(end, 1, ...splitTableData)
    this.data._table[dataKey] = tableData

    return detailsPageHeight
  }

  @action
  computedPages() {
    // 每页必有 页眉header, 页脚footer
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

        const { subtotal, dataKey, summaryConfig } = content
        // 如果显示每页合计,那么table高度多预留一行高度
        const subtotalTrHeight = subtotal.show ? getSumTrHeight(subtotal) : 0
        // 如果每页合计(新的),那么table高度多预留一行高度
        const pageSummaryTrHeight =
          summaryConfig?.pageSummaryShow && !isMultiTable(dataKey) // 双栏table没有每页合计
            ? getSumTrHeight(summaryConfig)
            : 0
        // 每个表格都具有的高度
        const allTableHaveThisHeight =
          table.head.height + subtotalTrHeight + pageSummaryTrHeight
        /** 当前page页面的最小高度 */
        const currentPageMinimumHeight =
          allPagesHaveThisHeight + allTableHaveThisHeight
        /** 当前page可容纳的table高度 */
        let pageAccomodateTableHeight = +new Big(this.pageHeight)
          .minus(currentPageHeight)
          .toFixed(2)

        // 表格行的索引,用于table.slice(begin, end), 分割到不同页面中
        let begin = 0
        let end = 0

        // 如果表格没有数据,那么轮一下个content
        if (table.body.heights.length === 0) {
          index++
        } else {
          /** 仅计算当前页table的累积高度 */
          let currentTableHeight = allTableHaveThisHeight
          // 表格有数据,添加[每个表格都具有的高度]
          currentPageHeight += allTableHaveThisHeight
          /** 当前table剩余的高度 */
          let currentRemainTableHeight = 0
          /** 去最小的tr高度，用于下面的计算compare,(避免特殊情况：一般来说最小tr——height = 23, 比23还小的不考虑计算) */
          const minHeight = Math.max(getArrayMid(table.body.heights), 23)

          /* 遍历表格每一行，填充表格内容 */
          while (end < table.body.heights.length) {
            currentTableHeight += table.body.heights[end]
            // 用于计算最后一页有footer情况的高度
            currentPageHeight += table.body.heights[end]
            // 当前页没有多余空间
            if (currentTableHeight > pageAccomodateTableHeight) {
              currentRemainTableHeight = +Big(pageAccomodateTableHeight)
                .minus(currentTableHeight)
                .plus(table.body.heights[end])

              /**
               * 说明： 1. currentRemainTableHeight > minHeight 要比最小度高高，不然每次到这都进入if
               * 2. table.body.heights[end]至少要是currentRemainTableHeight的 2倍，怕出现打印时最后一行文字显示一半的情况
               * 3. table.body.heights[end] 高度超过了 pageAccomodateTableHeight
               */
              if (
                (currentRemainTableHeight > minHeight &&
                  table.body.heights[end] / currentRemainTableHeight > 2) ||
                table.body.heights[end] > pageAccomodateTableHeight
              ) {
                const detailsPageHeight = this.computedData(
                  dataKey,
                  table,
                  end,
                  currentRemainTableHeight
                )
                // 拆分明细后，同时也要更新body.heights 不能影响后续计算
                table.body.heights.splice(end, 1, ...detailsPageHeight)
                end++
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
              if (end === table.body.heights.length) {
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
      const list = this.data._table[dataKey] || this.data._table.orders

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
          return list.map(d => `${compiled(d)}`).join(separator)
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

      // 兼容之前已经添加上最后一列的模板
      // if (!detailLastColType) {
      //   detailsList = detailsList
      //     ? detailsList.map(d => `<div> ${compiled(d)} </div>`).join('')
      //     : []
      // } else {
      //   // 多栏商品时，同一行仅有一个商品，后面空余部分显示空白
      //   if (detailsList) {
      //     // detailLastColType ---> 区分采购明细单列——最后一列是否换行
      //     detailsList =
      //       detailLastColType === 'purchase_last_col'
      //         ? detailsList.map(d => `<div> ${compiled(d)} </div>`).join('')
      //         : detailsList.map(d => `${compiled(d)}`).join(separator)
      //   } else {
      //     detailsList = []
      //   }
      // }

      return detailsList
    } catch (err) {
      return text
    }
  }
}

export default PrinterStore
