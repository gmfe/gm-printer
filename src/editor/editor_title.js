import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { observer } from 'mobx-react'
import { Flex } from 'react-gm'
import { doPrint } from '../printer'
import { toJS } from 'mobx'

@observer
class EditorTitle extends React.Component {
  handleUndo = () => {
    editStore.undo()
  }

  handleRedo = () => {
    editStore.redo()
  }

  handleTestPrint = () => {
    const { data } = this.props
    doPrint({
      config: toJS(editStore.config),
      data
    })
  }

  render () {
    return (
      <Flex justifyBetween className='gm-padding-10'>
        <Flex alignCenter>
          <i className='xfont xfont-bill' style={{ color: 'rgb(253, 82, 113)' }}/>基本信息
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
    )
  }
}

EditorTitle.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditorTitle
