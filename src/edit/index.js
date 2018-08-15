import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { Printer, doPrint } from '../printer'
import EditHeader from './edit_header'
import editCSS from './style.less'
import _ from 'lodash'
import { getStyleWithDiff, insertCSS, getBlockName } from '../util'
import { blockTypeList, panelList } from '../config'
import { observer } from 'mobx-react/index'

insertCSS(editCSS)

@observer
class Edit extends React.Component {
  constructor (props) {
    super(props)

    editStore.setConfig(props.config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', e => {
      const {selected} = e.detail

      editStore.setSelected(selected)
    })

    window.document.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    if (!(editStore.computedIsSelectBlock && e.code.startsWith('Arrow'))) {
      return
    }

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
  }

  // TODO
  handleSave = () => {
  }

  handleInsert = (type) => {
    const panel = editStore.insertPanel

    editStore.addConfigBlock(panel, type)
    editStore.setSelected(getBlockName(panel, editStore.config[panel].blocks.length - 1))
  }

  handleTestPrint = () => {
    const {data, tableData} = this.props
    doPrint({
      config: toJS(editStore.config),
      data,
      tableData
    })
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
          <div className='gm-printer-edit-header-top'>
            <div>
              <select value={editStore.insertPanel} onChange={e => editStore.setInsertPanel(e.target.value)}>
                {_.map(panelList, v => <option key={v.value} value={v.value}>{v.text}</option>)}
              </select>
              &nbsp;&nbsp;
              <span>插入</span>
              &nbsp;&nbsp;
              {_.map(blockTypeList, v => (
                <button
                  key={v.value}
                  onClick={this.handleInsert.bind(this, v.value)}
                >{v.text}</button>
              ))}
            </div>
            <div>
              <button onClick={this.handleTestPrint}>测试打印</button>
              <button>保存</button>
            </div>
          </div>
          <div className='gm-printer-edit-header-bottom'>
            <EditHeader/>
          </div>
        </div>
        <div className='gm-printer-edit-content'>
          <Printer
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
