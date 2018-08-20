import { observable, action, computed, configure } from 'mobx'
import { panelList } from '../config'
import _ from 'lodash'
import { exchange } from '../util'
import UndoManager from './undo_manager'

const undoManager = new UndoManager()
undoManager.setLimit(30)

configure({enforceActions: true})

class EditStore {
  @observable
  config = null

  // panel.header
  // panel.header.block.1
  // table.column.1
  @observable
  selected = null

  @observable
  insertPanel = panelList[0].value

  @observable
  cacheConfig = []

  @observable
  hasUndo = false

  @observable
  hasRedo = false

  @computed
  get computedPrinterKey () {
    return _.map(this.config, (v, k) => {
      if (k === 'table') {
        return v.columns.length + '_' + v.className + '_' + v.type
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
  init () {
    this.config = null
    this.selected = null
    this.insertPanel = panelList[0].value
  }

  @action
  setConfig (config) {
    this.config = config
    this.cacheConfig.push(JSON.stringify(config))
  }

  @action
  setSelected (selected = null) {
    this.selected = selected
  }

  @computed
  get computedIsSelectPanel () {
    return this.selected && this.selected.split('.').length === 2
  }

  @computed
  get computedIsSelectBlock () {
    return this.selected && this.selected.split('.').length === 4
  }

  @computed
  get computedIsSelectTable () {
    return this.selected && this.selected.split('.').length === 3
  }

  @computed
  get computedSelectedInfo () {
    if (!this.selected) {
      return null
    }

    const arr = this.selected.split('.')
    if (arr.length === 2) {
      return this.config[arr[1]]
    } else if (arr.length === 4) {
      return this.config[arr[1]].blocks[arr[3]]
    } else if (arr.length === 3) {
      return this.config.table.columns[arr[2]]
    }
  }

  @action
  setConfigBlockBy (who, value) {
    if (!this.computedIsSelectBlock) {
      return
    }

    const block = this.computedSelectedInfo
    block[who] = value
  }

  @action
  addConfigBlock (panel, type) {
    if (!type || type === 'text') {
      this.config[panel].blocks.push({
        text: '请编辑',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px'
        }
      })
    } else if (type === 'line') {
      this.config[panel].blocks.push({
        type: 'line',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px',
          borderTopColor: 'black',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          width: '100%'
        }
      })
    } else if (type === 'image') {
      this.config[panel].blocks.push({
        type: 'image',
        link: '',
        style: {
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px'
        }
      })
    } else {
      window.alert('出错啦，未识别类型，此信息不应该出现')
    }
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
    this.config.table.type = type
  }

  @action
  setConfigTableClassName (className) {
    this.config.table.className = className
    console.log(this.config.table)
  }

  @action
  exchangeTableColumn (target, source) {
    if (this.computedIsSelectTable) {
      exchange(this.config.table.columns, target, source)
    }
  }

  @action
  addTableColumn () {
    this.config.table.columns.push({
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

  @action
  removeConfig () {
    if (this.computedIsSelectBlock) {
      const arr = this.selected.split('.')
      this.selected = null
      this.config[arr[1]].blocks.splice(arr[3], 1)
    } else if (this.computedIsSelectTable) {
      const arr = this.selected.split('.')
      this.selected = null
      this.config.table.columns.splice(arr[2], 1)
    }
  }

  @action
  saveConfigToCache () {
    const lastConfig = this.cacheConfig.slice(-1)[0]
    const configStr = JSON.stringify(this.config)

    if (lastConfig !== configStr) {
      this.cacheConfig.push(configStr)
      this._saveCache()

      this.checkUndoRedo()

      undoManager.add({
        undo: () => {
          if (this.cacheConfig.length > 1) {
            this.cacheConfig.pop()
            this.config = JSON.parse(this.cacheConfig.slice(-1)[0])
            this._saveCache()
          }
        },
        redo: () => {
          this.config = JSON.parse(configStr)
          this.cacheConfig.push(configStr)
          this._saveCache()
        }
      })
    }
  }

  @action
  undo () {
    this.selected = null
    undoManager.undo()
    this.checkUndoRedo()
  }

  @action
  redo () {
    this.selected = null
    undoManager.redo()
    this.checkUndoRedo()
  }

  @action
  checkUndoRedo () {
    this.hasUndo = undoManager.hasUndo()
    this.hasRedo = undoManager.hasRedo()
  }

  @action
  _saveCache () {
    if (this.cacheConfig.length > 30) {
      this.cacheConfig = this.cacheConfig.slice(-30)
    }
  }
}

window.undoManager = undoManager

const editStore = new EditStore()

export default editStore
