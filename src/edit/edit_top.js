import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import { observer } from 'mobx-react/index'

@observer
class EditTop extends React.Component {
  handleTestPrint = () => {
    const {data} = this.props
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

  render () {

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
