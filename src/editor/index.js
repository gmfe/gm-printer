import './style.less'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { toJS } from 'mobx'
import editStore from './store'
import { getCSS, Printer } from '../printer'
import { getStyleWithDiff, insertCSS } from '../util'
import { observer } from 'mobx-react/index'
import EditorTitle from './editor_title'
import EditorSelect from './editor_select'
import EditorField from './editor_field'
import EditorAddField from './editor_add_field'
import ContextMenu from './context_menu'
import mockData from './mock'

insertCSS(getCSS())

@observer
class Editor extends React.Component {
  constructor (props) {
    super(props)

    let config = props.config
    editStore.init(config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.addEventListener('gm-printer-select-region', this.handleSelectedRegion)
    window.document.addEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.addEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.addEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.addEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.addEventListener('keydown', this.handleKeyDown)

    this.autoSaveTimer = setInterval(() => {
      editStore.saveConfigToStack()
    }, 1000)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.removeEventListener('gm-printer-select-region', this.handleSelectedRegion)
    window.document.removeEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.removeEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.removeEventListener('keydown', this.handleKeyDown)

    clearInterval(this.autoSaveTimer)
  }

  handleSave = () => {
    this.props.onSave(toJS(editStore.config))
  }

  handleSelectedRegion = e => {
    const { selected } = e.detail
    editStore.setSelectedRegion(selected)
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
          <EditorTitle data={mockData} onSave={this.handleSave} onDraft={this.handleDraft}/>
          <EditorSelect/>
          <EditorField/>
          <EditorAddField data={mockData}/>
        </div>
        {/* Printer config 的 高度调整需要重新 render ，可把高度做key */}
        <ContextMenu className='gm-printer-edit-content' onClick={this.handleCancel}>
          <Printer
            key={editStore.computedPrinterKey}
            selected={editStore.selected}
            config={editStore.config}
            data={mockData}
          />
        </ContextMenu>
      </div>
    )
  }
}

Editor.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func
}

Editor.deaultProps = {
  onSave: _.noop
}

export default Editor
