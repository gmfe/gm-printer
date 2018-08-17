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

insertCSS(editCSS)

@observer
class Edit extends React.Component {
  constructor (props) {
    super(props)

    editStore.init()

    editStore.setConfig(props.config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)

    window.document.addEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)

    window.document.addEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)

    window.document.addEventListener('keydown', this.handleKeyDown)

    this.autoSaveTimer = setInterval(() => {
      editStore.saveConfigToCache()
    }, 1000)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.removeEventListener('keydown', this.handleKeyDown)

    clearInterval(this.autoSaveTimer)
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
    editStore.setConfigBlock('style', style)
  }

  handlePrinterTableDrag = (e) => {
    console.log(e.detail)
    editStore.exchangeTableColumn(e.detail.target, e.detail.source)
  }

  handleKeyDown = (e) => {
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

      editStore.setConfigBlock('style', newStyle)
    } else if (e.code === 'Escape' && editStore.selected) {
      e.preventDefault()
      editStore.setSelected(null)
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
          <EditTop data={data} tableData={tableData} onSave={this.handleSave}/>
          <hr/>
          <EditBottom/>
        </div>
        <div className='gm-printer-edit-content' onClick={this.handleCancel}>
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
