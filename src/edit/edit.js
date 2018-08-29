import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { toJS } from 'mobx'
import editStore from './store'
import { Printer } from '../printer'
import editCSS from './style.less'
import { getStyleWithDiff, insertCSS } from '../util'
import { observer } from 'mobx-react/index'
import EditBottom from './edit_bottom'
import EditTop from './edit_top'

const STORAGE_CACHE = 'gm-printer-config-cache'

insertCSS(editCSS)

@observer
class Edit extends React.Component {
  constructor (props) {
    super(props)



    let config = props.config

    let sConfig = window.localStorage.getItem(STORAGE_CACHE)
    if (sConfig) {
      try {
        sConfig = JSON.parse(sConfig)

        if (window.confirm('发现草稿，是否加载')) {
          config = sConfig
        } else {
          window.localStorage.removeItem(STORAGE_CACHE)
        }
      } catch (err) {
      }
    }

    editStore.init(config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)
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
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.removeEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.removeEventListener('keydown', this.handleKeyDown)

    clearInterval(this.autoSaveTimer)
  }

  handleDraft = () => {
    window.localStorage.setItem(STORAGE_CACHE, JSON.stringify(toJS(editStore.config)))
  }

  handleSave = () => {
    this.props.onSave(toJS(editStore.config))
  }

  handlePrinterSelect = (e) => {
    const {selected} = e.detail

    editStore.setSelected(selected)
  }

  handlePrinterBlockStyleSet = (e) => {
    const {style} = e.detail
    editStore.setConfigBlockBy('style', style)
  }

  handlePrinterBlockTextSet = (e) => {
    const {text} = e.detail
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

    if (e.code.startsWith('Arrow') && editStore.computedIsSelectBlock) {
      e.preventDefault()

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
    const {
      data, tableData
    } = this.props

    // Printer config 的 高度调整需要重新 render ，可把高度做key

    return (
      <div className='gm-printer-edit'>
        <div className='gm-printer-edit-header'>
          <EditTop data={data} tableData={tableData} onSave={this.handleSave} onDraft={this.handleDraft}/>
          <hr/>
          <EditBottom/>
        </div>
        <div className='gm-printer-edit-content' onClick={this.handleCancel}>
          <div className='gm-printer-edit-content-tip'>
            单击选中内容，双击编辑，可拖动以摆放位置，可方向键细调位置
          </div>
          <Printer
            key={editStore.computedPrinterKey}
            selected={editStore.selected}
            config={editStore.config}
            data={data}
            tableData={tableData}
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func
}

Edit.deaultProps = {
  onSave: _.noop
}

export default Edit
