import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { toJS } from 'mobx'
import { doPrint } from '../printer'
import { observer } from 'mobx-react/index'
import { configTempList, pageTypeMap } from '../config'
import _ from 'lodash'
import { Flex, Select, Option } from 'react-gm'

@observer
class EditorTitle extends React.Component {
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

  handleInsertTemp = (value) => {
    if (value) {
      const temp = _.find(configTempList, temp => temp.value === value)
      editStore.setConfig(temp.config)
    }
  }

  handlePageType = (value) => {
    editStore.setSizePageType(value)
  }

  render () {
    return (
      <div className='gm-printer-edit-header-top'>

        <Flex justifyBetween className='gm-padding-10'>
          <Flex alignCenter>
            <i className='xfont xfont-bill'/>基本信息
          </Flex>
          <div>
            <button className='btn btn-primary btn-md' onClick={this.handleUndo} disabled={!editStore.hasUndo}>撤销
            </button>
            <div className='gm-gap-10'/>
            <button className='btn btn-primary btn-md' onClick={this.handleRedo} disabled={!editStore.hasRedo}>重做
            </button>
            <div className='gm-gap-10'/>
            <button className='btn btn-primary btn-md' onClick={this.props.onSave}>保存</button>
          </div>
        </Flex>

        <div className='gm-padding-10'>
          <Flex alignCenter>
            <div className='gm'>尺寸：</div>
            <Select value={editStore.config.page.type} onChange={this.handlePageType}>
              {_.map(pageTypeMap, (v, k) => <Option key={k} value={k}>{k}</Option>)}
            </Select>
          </Flex>
        </div>

      </div>
    )
  }
}

EditorTitle.propTypes = {
  data: PropTypes.object.isRequired,
  onDraft: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditorTitle
