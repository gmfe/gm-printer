import { observable, action, configure } from 'mobx'
import _ from 'lodash'
import { pageSizeMap } from '../config'

configure({enforceActions: true})

class PrinterStore {
  @observable
  size = pageSizeMap.A4.size

  @observable
  gap = pageSizeMap.A4.gap

  @observable
  ready = false

  @observable
  height = {
    top: 0,
    header: 0,
    table: 0,
    bottom: 0,
    sigh: 0,
    footer: 0,
    page: 0
  }

  @observable
  table = {
    data: [],
    head: {
      widths: [],
      height: 0
    },
    body: {
      heights: []
    }
  }

  @observable
  page = [] // [{begin, end, bottomPage}]

  data = {}
  tableData = []

  // 选中某个东西，具体见 edit/store.js 定义
  @observable
  selected = null

  @action
  init () {
    this.size = pageSizeMap.A4.size
    this.gap = pageSizeMap.A4.gap
    this.ready = false
    this.height = {
      top: 0,
      header: 0,
      table: 0,
      bottom: 0,
      sigh: 0,
      footer: 0,
      page: 0
    }
    this.table = {
      data: [],
      head: {
        widths: [],
        height: 0
      },
      body: {
        heights: []
      }
    }
    this.page = []
    this.data = {}
    this.tableData = []
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
  setHeight (height) {
    this.height = Object.assign(this.height, height)
  }

  @action
  setTable (table) {
    this.table = table
  }

  @action
  setReady (ready) {
    this.ready = ready
  }

  @action
  setPage () {
    if (this._onePage()) {
      return
    }

    if (this._twoPage()) {
      return
    }

    this._morePage()
  }

  @action
  _onePage () {
    const height =
      this.height.header +
      this.height.top +
      this.height.table +
      this.height.bottom +
      this.height.sign +
      this.height.footer

    if (height > this.height.page) {
      return false
    }

    this.page = [{
      begin: 0,
      end: this.table.data.length
    }]

    return true
  }

  @action
  _twoPage () {
    const height =
      this.height.header * 2 +
      this.height.top +
      this.height.table +
      this.table.head.height +
      this.height.bottom +
      this.height.sign +
      this.height.footer * 2

    if (height > (this.height.page * 2)) {
      return false
    }

    let oneHeight =
      this.height.header +
      this.height.top +
      this.table.head.height +
      this.table.body.heights[0] +
      this.height.footer
    let oneEnd = 1

    while (oneHeight < this.height.page) {
      oneHeight += this.table.body.heights[oneEnd]
      oneEnd++
    }

    this.page = [{
      begin: 0,
      end: oneEnd - 1
    }, {
      begin: oneEnd - 1,
      end: this.table.data.length
    }]

    return true
  }

  @action
  _morePage () {
    let oneHeight =
      this.height.header +
      this.height.top +
      this.table.head.height +
      this.table.body.heights[0] +
      this.height.footer
    let end = 1
    let oEnd = 0

    const page = []

    while (oneHeight < this.height.page) {
      oneHeight += this.table.body.heights[end]
      end++
    }

    page.push({
      begin: oEnd,
      end: end - 1
    })
    oEnd = end

    while (end <= this.table.data.length) {
      let moreHeight =
        this.height.header +
        this.table.head.height +
        this.table.body.heights[0] +
        this.height.footer

      while (moreHeight < this.height.page) {
        moreHeight += this.table.body.heights[end]
        end++
      }

      page.push({
        begin: oEnd,
        end: end - 1
      })
      oEnd = end
    }

    // 如果最后一页高度不够，就补多一个页面
    const lastHeight =
      this.height.header +
      this.table.head.height +
      _.sum(this.table.body.heights.slice(page.slice(-1)[0].begin)) +
      this.height.bottom +
      this.height.sign +
      this.height.footer

    if (lastHeight > this.height.page) {
      page.push({
        bottomPage: true
      })
    }

    this.page = page

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
          count: this.page.length
        }
      })
    } catch (err) {
      console.warn(err)
      return text
    }
  }

  templateTable (text, i, tableData) {
    // cache 之后表格数据重复,所以不cache
    // if (templateCache[text]) {
    //   return templateCache[text]
    // }
    try {
      return _.template(text)({
        data: this.data,
        tableData: tableData[i]
      })
    } catch (err) {
      console.warn(err)
      return text
    }
  }

  templatePagination (text, pageIndex) {
    // 不cache page 会变
    try {
      return _.template(text)({
        data: this.data,
        pagination: {
          pageIndex: pageIndex + 1,
          count: this.page.length
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
