import { action, configure, observable } from 'mobx'
import _ from 'lodash'
import { toKey } from './key'

configure({ enforceActions: true })

class PrinterStore {
  @observable
  ready = false

  @observable
  config = {}

  @observable
  pageHeight = {}

  @observable
  height = {}

  @observable
  contents = []

  @observable
  tablesInfo = {}

  @observable
  pages = [] // [{type, index, begin, end}]

  data = {}

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  // 选择中区域
  @observable
  selectedRegion = null

  @action
  init (config, data) {
    this.ready = false
    this.config = config
    this.height = {}
    this.contents = []
    this.tablesInfo = {}
    this.pages = []
    this.data = toKey(data)
    this.selected = null
  }

  @action
  setPageHeight (height) {
    this.pageHeight = height
  }

  @action
  setHeight (who, height) {
    this.height[who] = height
  }

  @action
  setTable (name, table) {
    this.tablesInfo[name] = table
  }

  @action
  setReady (ready) {
    this.ready = ready
  }

  @action
  setSelected (selected) {
    this.selected = selected || null
  }

  @action
  setSelectedRegion (selected) {
    this.selectedRegion = selected || null
  }

  @action
  computedPages () {
    // 每页必有 header footer
    const allPagesHaveThisHeight = this.height.header + this.height.footer
    // 只有第一页有counter
    let height = allPagesHaveThisHeight + this.height.counter
    // console.log(this.pageHeight)

    // 当前在处理 contents 的索引
    let index = 0

    let page = []

    // 轮 contents
    while (index < this.config.contents.length) {
      if (this.config.contents[index].type === 'table') {
        const info = this.tablesInfo[`contents.table.${index}`]
        let begin = 0
        let end = 0

        // 如果显示每页小计,那么table高度多预留一行, 一行的高度默认26
        if (this.config.contents[index].subtotal.show) {
          height += 26
        }

        // 如果表格没有数据,那么轮一下个content
        if (info.body.heights.length === 0) {
          index++
        } else {
          // 表格有数据,必有表头(虽然表头高度可能为0)
          height += info.head.height

          while (end < info.body.heights.length) {
            height += info.body.heights[end]

            // 如果没有多余空间了
            if (height > this.pageHeight) {
              // end 为 0 ，即只有表头，没有必要加进去，应放下一页显示
              if (end !== 0) {
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
              height = allPagesHaveThisHeight + info.head.height
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
        height += this.height[`contents.panel.${index}`]

        if (height < this.pageHeight) {
          // 空间充足，把信息加入 page，并轮下一个contents
          page.push({
            type: 'panel',
            index
          })

          index++
        } else {
          // 空间不足，此页完成任务
          this.pages.push(page)

          // 为下一页做准备
          page = []
          height = allPagesHaveThisHeight
        }
      }
    }

    this.pages.push(page)
  }

  template (text, pageIndex) {
    // 做好保护，出错就返回 text
    try {
      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data,
        '当前页码': pageIndex + 1,
        '页码总数': this.pages.length
      })
    } catch (err) {
      // console.warn(err)
      return text
    }
  }

  templateTable (text, dataKey, index, pageIndex) {
    // 做好保护，出错就返回 text
    try {
      const list = this.data._table[dataKey] || this.data._table.orders

      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data,
        '列': list[index],
        '当前页码': pageIndex + 1,
        '页码总数': this.pages.length
      })
    } catch (err) {
      // console.warn(err)
      return text
    }
  }
}

export default PrinterStore
