import { observable, action, computed, configure } from 'mobx'
import _ from 'lodash'
import { exchange, getBlockName } from '../util'
import UndoManager from './undo_manager'

const undoManager = new UndoManager()
undoManager.setLimit(30)

configure({enforceActions: true})

class EditStore {
  @observable
  config = null

  // header
  // header.block.1
  // contents.panel.1.block.1
  // contents.table.2.column.1
  @observable
  selected = null

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
      if (k === 'contents') {
        return _.map(v, vv => {
          if (vv.type === 'table') {
            return vv.columns.length + '_' + vv.className
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
    this.insertPanel = 'header'

    this._cacheConfig.push(JSON.stringify(config))
  }

  @action
  setSelected (selected = null) {
    console.log(selected)
    this.selected = selected
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
  setConfigTableType (type) {
    // TODO
    this.config.table.type = type
  }

  @action
  setConfigTableClassName (name, className) {
    const arr = name.split('.')
    this.config.contents[arr[2]].className = className
  }

  @action
  exchangeTableColumn (target, source) {
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const {columns} = this.config.contents[arr[2]]

      if (target >= 0 && target < columns.length) {
        exchange(columns, target, source)
        arr[4] = target
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

  @action
  addTableColumn (index) { // index 可选
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const {columns} = this.config.contents[arr[2]]

      index = index === undefined ? columns.length : index

      if (index >= 0 && index < columns.length) {
        columns.splice(index, 0, {
          head: '表头',
          headStyle: {
            textAlign: 'center'
          },
          text: '内容',
          style: {
            textAlign: 'center'
          }
        })
      }
    }
  }

  @action
  addTableColumnByDiff (diff) {
    if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      const source = ~~arr[4]

      this.addTableColumn(source + diff)
    }
  }

  @action
  removeConfig () {
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
      source.splice(arr[4], 1)
    }

    this.selected = null
  }

  @action
  saveConfigToStack () {
    const lastConfig = this._cacheConfig.slice(-1)[0]
    const configStr = JSON.stringify(this.config)

    if (lastConfig !== configStr) {
      this._cacheConfig.push(configStr)
      this._saveStack()

      this._updateUndoRedo()

      undoManager.add({
        undo: () => {
          if (this._cacheConfig.length > 1) {
            this._cacheConfig.pop()
            this.config = JSON.parse(this._cacheConfig.slice(-1)[0])
            this._saveStack()
          }
        },
        redo: () => {
          this.config = JSON.parse(configStr)
          this._cacheConfig.push(configStr)
          this._saveStack()
        }
      })
    }
  }

  @action
  undo () {
    this.selected = null
    undoManager.undo()
    this._updateUndoRedo()
  }

  @action
  redo () {
    this.selected = null
    undoManager.redo()
    this._updateUndoRedo()
  }

  @action
  _updateUndoRedo () {
    this.hasUndo = undoManager.hasUndo()
    this.hasRedo = undoManager.hasRedo()
  }

  @action
  _saveStack () {
    if (this._cacheConfig.length > 30) {
      this._cacheConfig = this._cacheConfig.slice(-30)
    }
  }
}

window.undoManager = undoManager

const editStore = new EditStore()

export default editStore
