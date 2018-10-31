import React from 'react'
import PropTypes from 'prop-types'
import editStore from './store'
import { observer } from 'mobx-react/index'
import { Flex } from 'react-gm'

@observer
class EditorTitle extends React.Component {
  handleUndo = () => {
    editStore.undo()
  }

  handleRedo = () => {
    editStore.redo()
  }

  handlePageType = (value) => {
    editStore.setSizePageType(value)
  }

  render () {
    return (
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
    )
  }
}

EditorTitle.propTypes = {
  data: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
}

export default EditorTitle
