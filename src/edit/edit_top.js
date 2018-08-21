import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import _ from 'lodash'
import { getBlockName, getTableColumnName } from '../util'
import { blockTypeList, panelList, tableClassNameList, tableTypeList } from '../config'
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
    editStore.setSelected(getTableColumnName(editStore.config.table.columns.length - 1))
  }

  handleUndo = () => {
    editStore.undo()
  }

  handleRedo = () => {
    editStore.redo()
  }

  handleTableClassName = (e) => {
    editStore.setConfigTableClassName(e.target.value)
  }

  handleTableType = (e) => {
    editStore.setConfigTableType(e.target.value)
  }

  renderTable () {
    const {type, className} = editStore.config.table
    return (
      <React.Fragment>
        <button onClick={this.handleTableAdd}>插入一列</button>
        <div>
          样式
          <select value={className || ''} onChange={this.handleTableClassName}>
            {_.map(tableClassNameList, v => (
              <option key={v.value} value={v.value}>{v.text}</option>
            ))}
          </select>
          <br/>
          类型
          <select value={type || ''} onChange={this.handleTableType}>
            {_.map(tableTypeList, v => (
              <option key={v.value} value={v.value}>{v.text}</option>
            ))}
          </select>
        </div>
      </React.Fragment>
    )
  }

  renderPanel () {
    return (
      <React.Fragment>
        {_.map(blockTypeList, v => (
          <button
            key={v.value}
            onClick={this.handleInsert.bind(this, v.value)}
          >{v.text}</button>
        ))}
        <br/>
        高 <TextPX value={editStore.computedPanelHeight} onChange={this.handlePanelHeight}/>
      </React.Fragment>
    )
  }

  render () {
    return (
      <div className='gm-printer-edit-header-top'>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <button onClick={this.handleUndo} disabled={!editStore.hasUndo}>撤销</button>
            <button onClick={this.handleRedo} disabled={!editStore.hasRedo}>重做</button>
          </div>

          <div>
            <button onClick={this.handleTestPrint}>测试打印</button>
            <button onClick={this.props.onDraft}>保存草稿</button>
            <button onClick={this.props.onSave}>保存</button>
          </div>
        </div>
        <hr/>
        <div>
          <div style={{fontSize: '20px'}}>
            区域
            <select value={editStore.insertPanel} onChange={e => editStore.setInsertPanel(e.target.value)}>
              {_.map(panelList, v => <option key={v.value} value={v.value}>{v.text}</option>)}
            </select>
          </div>
          <span>插入</span>
          &nbsp;&nbsp;
          {editStore.insertPanel !== 'table' ? this.renderPanel() : this.renderTable()}
        </div>
      </div>
    )
  }
}

EditTop.propTypes = {
  data: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  onDraft: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditTop
