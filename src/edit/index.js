import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { Printer, doPrint } from '../printer'
import EditHeader from './edit_header'
import editCSS from './style.less'
import _ from 'lodash'
import { getStyleWithDiff, insertCSS } from '../util'
import { blockTypeList, panelList } from '../config'

insertCSS(editCSS)

class Edit extends React.Component {
  constructor (props) {
    super(props)
    Printer.setIsEdit(true)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-block-config-set', e => {
      const {detail: {config, name}} = e

      editStore.setName(name)
      editStore.setConfig(config)
    })

    window.document.addEventListener('keydown', e => {
      if (!editStore.name || !e.code.startsWith('Arrow')) {
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

      const newStyle = getStyleWithDiff(editStore.data.config.style, diffX, diffY)

      const newConfig = Object.assign({}, editStore.data.config, {
        style: newStyle
      })

      editStore.setConfigAndBroadcast(newConfig)
    })
  }

  // TODO
  handleSave = () => {
    console.log(Printer.getConfig())
  }

  handleInsert = (type) => {
    window.document.dispatchEvent(new window.CustomEvent('gm-printer-block-insert', {
      detail: {
        panel: editStore.insertPanel,
        type
      }
    }))
  }

  handleTestPrint = () => {
    const {config, data, tableData} = this.props
    doPrint({
      config,
      data,
      tableData
    })
  }

  render () {
    const {
      data, tableData,
      config
    } = this.props
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
            config={config}
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
