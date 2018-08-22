import { observable, action, configure } from 'mobx'
import _ from 'lodash'
import { pageSizeMap } from '../config'

configure({enforceActions: true})

class PrinterStore {
  @observable
  ready = false

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
  page = [] // [{type, index, begin, end, bottomPage}]

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
    this.height = {}
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
  setPageHeight (height) {
    this.pageHeight = height
  }

  @action
  setHeight (who, height) {
    this.height[who] = height
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

    this._morePage()
  }

  @action
  _onePage () {
    let height = this.height

    _.forEach(this.height, v => (height += v))

    if (height > this.pageHeight) {
      return false
    }

    this.page = [{
      type: 'panel',
      name: ''
    }, {
      type: 'footer'
    }]

    return true
  }

  @action
  _morePage () {
    let oneHeight =
      this.height.header +
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
