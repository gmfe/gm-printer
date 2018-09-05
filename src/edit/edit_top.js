import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import { observer } from 'mobx-react/index'
import { configTempList, pageTypeMap } from '../config'
import { Hr } from './component'
import _ from 'lodash'

@observer
class EditTop extends React.Component {
  handleTestPrint = () => {
    const { data } = this.props
    doPrint({
      config: toJS(editStore.config),
      data
    })
  }

  handleUndo = () => {
    editStore.undo()
  }

  handleRedo = () => {
    editStore.redo()
  }

  handleInsertTemp = (e) => {
    if (e.target.value) {
      const temp = _.find(configTempList, temp => temp.value === e.target.value)
      editStore.setConfig(temp.config)
    }
  }

  handlePageType = (e) => {
    editStore.setSizePageType(e.target.value)
  }

  render () {
    return (
      <div className='gm-printer-edit-header-top'>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
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
        <Hr/>
        <div>
          <div style={{ padding: '10px' }}>
            载入模板
            <select onChange={this.handleInsertTemp}>
              <option value=''>请选择</option>
              {_.map(configTempList, temp => <option key={temp.value} value={temp.value}>{temp.text}</option>)}
            </select>
            <br/>
            尺寸
            <select value={editStore.config.page.type} onChange={this.handlePageType}>
              {_.map(pageTypeMap, (v, k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

EditTop.propTypes = {
  data: PropTypes.object.isRequired,
  onDraft: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditTop
