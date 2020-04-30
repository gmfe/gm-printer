import i18next from '../../locales'
import { action, observable } from 'mobx'
import { getSumTrHeight, isMultiTable } from '../util'
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
    this.pages = []
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
  computedPages() {
    // 每页必有 header footer
    const allPagesHaveThisHeight = this.height.header + this.height.footer
    let height = allPagesHaveThisHeight

    // 当前在处理 contents 的索引
    let index = 0

    let page = []

    // 如果除了contents外组件总高度  大于 页面高度, 那么退出计算(计算没意义,页眉页脚都装不下)
    if (height > this.pageHeight) {
      return
    }

    // 轮 contents
    while (index < this.config.contents.length) {
      if (this.config.contents[index].type === 'table') {
        const info = this.tablesInfo[`contents.table.${index}`]

        const { subtotal, dataKey, summaryConfig } = this.config.contents[index]
        // 如果显示每页合计,那么table高度多预留一行高度
        const subtotalTrHeight = subtotal.show ? getSumTrHeight(subtotal) : 0
        // 如果每页合计(新的),那么table高度多预留一行高度
        const pageSummaryTrHeight =
          summaryConfig?.pageSummaryShow && !isMultiTable(dataKey) // 双栏table没有每页合计
            ? getSumTrHeight(summaryConfig)
            : 0
        const allTableHaveThisHeight =
          info.head.height + subtotalTrHeight + pageSummaryTrHeight
        let begin = 0
        let end = 0

        // 如果表格没有数据,那么轮一下个content
        if (info.body.heights.length === 0) {
          index++
        } else {
          // 表格有数据,必有表头和合计(虽然表头高度可能为0)
          height += allTableHaveThisHeight

          while (end < info.body.heights.length) {
            height += info.body.heights[end]

            // 如果没有多余空间了
            if (height > this.pageHeight) {
              // end 为 0 ，即header,footer 和表头那些都放不下，容易在自定义纸张大小输入数值太小的情况，直接忽略不计算了
              if (end === 0) {
                index++
                break
              }
              if (end !== 0) {
                // ‼️‼️‼️ 极端情况: 如果一行的高度 大于 页面高度, 那么就做下一行
                if (
                  info.body.heights[end] +
                    allPagesHaveThisHeight +
                    allTableHaveThisHeight >
                  this.pageHeight
                ) {
                  end++
                }
                page.push({
                  type: 'table',
                  index,
                  begin,
                  end
                })
              }

              begin = end

              // 此页完成任务
              this.pages.push(page)

              // 为下页做好准备
              page = []
              height = allPagesHaveThisHeight + allTableHaveThisHeight
            } else {
              // 有空间，继续做下行
              end++

              // 最后一行，把信息加入 page，并轮下一个contents
              if (end === info.body.heights.length) {
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
      } else {
        // 非表格
        const panelHeight = this.height[`contents.panel.${index}`]
        height += panelHeight

        // 当 panel + allPagesHaveThisHeight > 页高度, 停止. 避免死循环
        if (panelHeight + allPagesHaveThisHeight > this.pageHeight) {
          break
        }

        if (height <= this.pageHeight) {
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
          height = allPagesHaveThisHeight
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
      // console.warn(err)
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
    const { specialDetailsKey, text } = col
    try {
      const row = this.data._table[dataKey][index]
      const compiled = _.template(text, { interpolate: /{{([\s\S]+?)}}/g })
      const detailsList = row[specialDetailsKey]

      return detailsList.map(d => `<div>${compiled(d)}</div>`).join('')
    } catch (err) {
      return text
    }
  }
}

export default PrinterStore
