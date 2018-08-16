import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import _ from 'lodash'
import { getBlockName } from '../util'
import { blockTypeList, panelList } from '../config'
import { TextPX } from './component'
import { observer } from 'mobx-react/index'

@observer
class EditTop extends React.Component {
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

  handlePanelHeight = (height) => {
    editStore.setPanelHeight(height)
  }

  handleTableAdd = () => {
    editStore.addTableColumn()
  }

  renderTable () {
    return (
      <React.Fragment>
        <button onClick={this.handleTableAdd}>插入一列</button>
      </React.Fragment>
    )
  }

  renderBlock () {
    return (
      <React.Fragment>
        {_.map(blockTypeList, v => (
          <button
            key={v.value}
            onClick={this.handleInsert.bind(this, v.value)}
          >{v.text}</button>
        ))}
        &nbsp;&nbsp;
        高 <TextPX value={editStore.computedPanelHeight} onChange={this.handlePanelHeight}/>
      </React.Fragment>
    )
  }

  render () {
    return (
      <div className='gm-printer-edit-header-top'>
        <div>
          区域
          &nbsp;&nbsp;
          <select value={editStore.insertPanel} onChange={e => editStore.setInsertPanel(e.target.value)}>
            {_.map(panelList, v => <option key={v.value} value={v.value}>{v.text}</option>)}
          </select>
          &nbsp;&nbsp;
          <span>插入</span>
          &nbsp;&nbsp;
          {editStore.insertPanel !== 'table' ? this.renderBlock() : this.renderTable()}
        </div>
        <div>
          <button onClick={this.handleTestPrint}>测试打印</button>
          <button>保存</button>
        </div>
      </div>
    )
  }
}

EditTop.propTypes = {
  data: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired
}

export default EditTop
