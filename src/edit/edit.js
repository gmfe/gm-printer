import './style.less'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { toJS } from 'mobx'
import editStore from './store'
import { Printer, getCSS } from '../printer'
import { getStyleWithDiff, insertCSS } from '../util'
import { Hr } from './component'
import { observer } from 'mobx-react/index'
import EditBottom from './edit_bottom'
import EditTop from './edit_top'
import ContextMenu from './context_menu'
import data from './data'
import Help from './help'

data.details = data.details.concat(data.details).concat(data.details).concat(data.details)

const STORAGE_CACHE = 'gm-printer-config-cache'

insertCSS(getCSS())

@observer
class Edit extends React.Component {
  constructor (props) {
    super(props)

    let config = props.config

    let sConfig = window.localStorage.getItem(STORAGE_CACHE)
    if (sConfig) {
      try {
        if (sConfig !== JSON.stringify(config)) {
          sConfig = JSON.parse(sConfig)

          if (window.confirm('发现草稿，是否加载')) {
            config = sConfig
          } else {
            window.localStorage.removeItem(STORAGE_CACHE)
          }
        }
      } catch (err) {
      }
    }

    editStore.init(config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.addEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.addEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.addEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.addEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.addEventListener('keydown', this.handleKeyDown)

    this.autoSaveTimer = setInterval(() => {
      editStore.saveConfigToStack()
    }, 1000)

    this.draftSaveTimer = setInterval(() => {
      this.handleDraft()
    }, 5000)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.removeEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.removeEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.removeEventListener('keydown', this.handleKeyDown)

    clearInterval(this.autoSaveTimer)
    clearInterval(this.draftSaveTimer)
  }

  handleDraft = () => {
    window.localStorage.setItem(STORAGE_CACHE, JSON.stringify(toJS(editStore.config)))
  }

  handleSave = () => {
    this.props.onSave(toJS(editStore.config))
  }

  handlePrinterSelect = (e) => {
    const { selected } = e.detail

    editStore.setSelected(selected)
  }

  handlePrinterPanelStyleSet = (e) => {
    const { name, style } = e.detail
    editStore.setConfigPanelStyle(name, style)
  }

  handlePrinterBlockStyleSet = (e) => {
    const { style } = e.detail
    editStore.setConfigBlockBy('style', style)
  }

  handlePrinterBlockTextSet = (e) => {
    const { text } = e.detail
    console.log('text', text)
    editStore.setConfigBlockBy('text', text)
  }

  handlePrinterTableDrag = (e) => {
    editStore.exchangeTableColumn(e.detail.target, e.detail.source)
  }

  handleKeyDown = (e) => {
    if (e.target !== window.document.body) {
      return
    }

    if (e.code.startsWith('Arrow')) {
      e.preventDefault()

      if (editStore.computedIsSelectBlock) {
        let diffX = 0
        let diffY = 0

        if (e.code === 'ArrowLeft') {
          diffX -= 1
        } else if (e.code === 'ArrowUp') {
          diffY -= 1
        } else if (e.code === 'ArrowRight') {
          diffX += 1
        } else if (e.code === 'ArrowDown') {
          diffY += 1
        }

        const newStyle = getStyleWithDiff(editStore.computedSelectedInfo.style, diffX, diffY)

        editStore.setConfigBlockBy('style', newStyle)
      } else if (editStore.computedIsSelectTable) {
        if (e.code === 'ArrowLeft') {
          editStore.exchangeTableColumnByDiff(-1)
        } else if (e.code === 'ArrowRight') {
          editStore.exchangeTableColumnByDiff(1)
        }
      }
    } else if (e.code === 'Escape' && editStore.selected) {
      e.preventDefault()
      editStore.setSelected(null)
    } else if (e.code === 'Backspace' && editStore.selected) {
      e.preventDefault()
      editStore.removeConfig()
    }
  }

  handleCancel = (e) => {
    if (e.target === e.currentTarget) {
      editStore.setSelected(null)
    }
  }

  render () {
    return (
      <div className='gm-printer-edit'>
        <div className='gm-printer-edit-header'>
          <EditTop data={data} onSave={this.handleSave} onDraft={this.handleDraft}/>
          <Hr/>
          <EditBottom/>
          <Hr/>
          <Help data={data}/>
        </div>
        <ContextMenu className='gm-printer-edit-content' onClick={this.handleCancel}>
          <div className='gm-printer-edit-content-tip'>
            单击选中内容，可双击编辑，可拖动以摆放位置，可方向键细调位置。右键使用更多功能。
          </div>
          {/* Printer config 的 高度调整需要重新 render ，可把高度做key */}
          <Printer
            key={editStore.computedPrinterKey}
            selected={editStore.selected}
            config={editStore.config}
            data={data}
            onChange={this.handleChange}
          />
        </ContextMenu>
      </div>
    )
  }
}

Edit.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func
}

Edit.deaultProps = {
  onSave: _.noop
}

export default Edit
