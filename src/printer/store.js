import { observable, action, configure } from 'mobx'
import _ from 'lodash'
import { pageSizeMap } from '../config'
import { toKey } from './key'

configure({ enforceActions: true })

class PrinterStore {
  @observable
  ready = false

  @observable
  config = {}

  @observable
  pageHeight = pageSizeMap

  @observable
  height = {}

  @observable
  contents = []

  /* {
    head: {
      widths: [],
      height: 0
    },
    body: {
      heights: []
    }
  } */
  @observable
  tablesInfo = {}

  @observable
  pages = [] // [{type, index, begin, end}]

  data = {}

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  @action
  init (config, data) {
    this.config = config
    this.ready = false
    this.height = {}
    this.pages = []
    this.data = toKey(data)
    this.tablesInfo = {}
    this.selected = null

    const temp = pageSizeMap[this.config.page.type]
    if (temp) {
      this.config.page.size = temp.size
      this.config.page.gap = temp.gap
    }
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
  setPages () {
    let height =
      this.height.header +
      this.height.footer

    let index = 0

    let page = []

    // TODO 有bug
    // 轮 contents
    while (index < this.config.contents.length) {
      if (this.config.contents[index].type === 'table') {
        const info = this.tablesInfo[`contents.table.${index}`]
        let begin = 0
        let end = 0

        height += info.head.height
        while (end < info.body.heights.length) {
          height += info.body.heights[end]
          if (height > this.pageHeight) {
            page.push({
              type: 'table',
              index,
              begin,
              end
            })
            this.pages.push(page)
            page = []
            height =
              this.height.header +
              this.height.footer +
              info.head.height
            begin = end
          } else {
            end++
            if (end === info.body.heights.length) {
              page.push({
                type: 'table',
                index,
                begin,
                end
              })
            }
          }
        }

        index++
      } else {
        height += this.height[`contents.panel.${index}`]

        if (height < this.pageHeight) {
          page.push({
            type: 'panel',
            index
          })
          index++
        } else {
          height =
            this.height.header +
            this.height.footer
          this.pages.push(page)
          page = []
        }
      }
    }

    this.pages.push(page)

    return true
  }

  template (text, pageIndex) {
    try {
      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data,
        '当前页码': pageIndex + 1,
        '总页码数': this.pages.length
      })
    } catch (err) {
      // console.warn(err)
      return text
    }
  }

  templateTable (text, dataKey, index, pageIndex) {
    try {
      const list = this.data[dataKey] || this.data.orders

      return _.template(text, {
        interpolate: /{{([\s\S]+?)}}/g
      })({
        ...this.data,
        '行': list[index],
        '索引': index + 1,
        '当前页码': pageIndex + 1,
        '总页码数': this.pages.length
      })
    } catch (err) {
      // console.warn(err)
      return text
    }
  }

  @action
  setSelected (selected) {
    this.selected = selected || null
  }
}

const printerStore = new PrinterStore()

export default printerStore
