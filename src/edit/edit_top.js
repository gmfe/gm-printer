import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import _ from 'lodash'
import { getTableColumnName } from '../util'
import { blockTypeList, tableClassNameList, tableTypeList } from '../config'
import { TextPX } from './component'
import { observer } from 'mobx-react/index'

@observer
class EditTop extends React.Component {
  handleInsert = (type) => {
    const panel = editStore.insertPanel

    editStore.addConfigBlock(panel, type)
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

  handlePanelSelect = (insertPanel) => {
    editStore.setInsertPanel(insertPanel)
  }

  render () {
    const panelList = [
      {value: 'header', text: '页眉'},
      {value: 'sign', text: '签名'},
      {value: 'footer', text: '页脚'}
    ]

    return (
      <div className='gm-printer-edit-header-top'>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
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
        <div style={{padding: '10px'}}>
          <div>
            <span>选择区域</span>
            &nbsp;
            {_.map(panelList, v => (
              <button
                key={v.value}
                className={classNames({
                  active: v.value === editStore.insertPanel
                })}
                onClick={this.handlePanelSelect.bind(this, v.value)}
              >{v.text}</button>
            ))}
          </div>
          <span>插入</span>
          &nbsp;
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
