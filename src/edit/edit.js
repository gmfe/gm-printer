import React from 'react'
import PropTypes from 'prop-types'
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

    editStore.setConfig(props.config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)

    window.document.addEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)

    window.document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('keydown', this.handleKeyDown)
  }

  handlePrinterSelect = (e) => {
    const {selected} = e.detail

    editStore.setSelected(selected)
  }

  handlePrinterBlockStyleSet = (e) => {
    const {style} = e.detail
    editStore.setConfigBlock('style', style)
  }

  handleKeyDown = (e) => {
    if (editStore.computedIsSelectBlock) {
      if (e.code.startsWith('Arrow')) {
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
      } else if (e.code === 'Escape') {
        e.preventDefault()
        editStore.setSelected(null)
      } else if (e.code === 'Backspace') {
        e.preventDefault()
        editStore.removeConfigBlock()
      }
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
        <div className='gm-printer-edit-header-fixed'/>
        <div className='gm-printer-edit-header'>
          <EditTop data={data} tableData={tableData}/>
          <EditBottom/>
        </div>
        <div className='gm-printer-edit-content' onClick={this.handleCancel}>
          <Printer
            key={editStore.computedHeightKey}
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
  onChange: PropTypes.func
}

Edit.deaultProps = {}

export default Edit
