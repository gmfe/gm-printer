import { observable, action, configure, toJS } from 'mobx'
import _ from 'lodash'
import { pageSizeMap } from '../config'

configure({enforceActions: true})

class PrinterStore {
  @observable
  ready = false

  @observable
  config = {}

  @observable
  size = pageSizeMap.A4.size

  @observable
  gap = pageSizeMap.A4.gap

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
  tableData = []

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  @action
  init (config) {
    this.config = config
    this.size = pageSizeMap.A4.size
    this.gap = pageSizeMap.A4.gap
    this.ready = false
    this.height = {}
    this.tables = []
    this.pages = []
    this.data = {}
    this.tablesInfo = {}
    this.selected = null
  }

  @action
  setSize (size) {
    if (_.isString(size) && pageSizeMap[size]) {
      this.size = pageSizeMap[size].size
    } else if (_.isObject(size)) {
      this.size = size
    }
  }

  @action
  setGap (gap) {
    if (_.isString(gap) && pageSizeMap[gap]) {
      this.gap = pageSizeMap[gap].gap
    } else if (_.isObject(gap)) {
      this.gap = gap
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

    while (index < this.config.contents.length) {
      if (this.config.contents[index].type === 'table') {
        const info = this.tablesInfo[`contents.table.${index}`]
        let begin = 0
        let end = 0

        height += info.head.height
        while (end < info.body.heights.length) {
          height += info.body.heights[end]
          console.log(height, this.pageHeight, end)
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
              index++
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

    console.log(toJS(this.pages))

    return true
  }

  @action
  setData (data) {
    this.data = data
  }

  @action
  setTableData (tableData) {
    this.tableData = tableData
  }

  template (text, pageIndex) {
    try {
      return _.template(text)({
        data: this.data,
        pagination: {
          pageIndex: pageIndex + 1,
          count: this.pages.length
        }
      })
    } catch (err) {
      console.warn(err)
      return text
    }
  }

  templateTable (text, index, tableData) {
    try {
      return _.template(text)({
        data: this.data,
        index: index + 1,
        tableData: tableData
      })
    } catch (err) {
      console.warn(err)
      return text
    }
  }

  templatePagination (text, pageIndex) {
    try {
      return _.template(text)({
        data: this.data,
        pagination: {
          pageIndex: pageIndex + 1,
          count: this.pages.length
        }
      })
    } catch (err) {
      console.warn(err)
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
