import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Flex } from 'react-gm'
import { toJS } from 'mobx'
import editStore from './store'
import { getCSS, Printer } from '../printer'
import { getStyleWithDiff, insertCSS } from '../util'
import { observer } from 'mobx-react/index'
import EditorTitle from './editor_title'
import EditorSelect from './editor_select'
import EditorField from './editor_field'
import EditorAddField from './editor_add_field'
import ContextMenu from './context_menu'
import { Gap, Title } from './component'
import mockData from '../mock_data/default_data'

import './style.less'

insertCSS(getCSS())

@observer
class Editor extends React.Component {
  constructor (props) {
    super()

    let config = props.config
    editStore.init(config)
  }

  componentDidMount () {
    window.document.addEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.addEventListener('gm-printer-select-region', this.handleSelectedRegion)
    window.document.addEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.addEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.addEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.addEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.document.removeEventListener('gm-printer-select', this.handlePrinterSelect)
    window.document.removeEventListener('gm-printer-select-region', this.handleSelectedRegion)
    window.document.removeEventListener('gm-printer-panel-style-set', this.handlePrinterPanelStyleSet)
    window.document.removeEventListener('gm-printer-block-style-set', this.handlePrinterBlockStyleSet)
    window.document.removeEventListener('gm-printer-block-text-set', this.handlePrinterBlockTextSet)
    window.document.removeEventListener('gm-printer-table-drag', this.handlePrinterTableDrag)
    window.document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleSave = () => {
    this.props.onSave(toJS(editStore.config))
  }

  handleSelectedRegion = e => {
    const { selected } = e.detail
    editStore.setSelectedRegion(selected)
  }

  handlePrinterSelect = (e) => {
    const { selected } = e.detail
    editStore.setSelected(selected)
  }

  handlePrinterPanelStyleSet = (e) => {
    const { name, style } = e.detail
    editStore.setConfigPanelStyle(name, style)
  }

  handlePrinterBlockStyleSet = (e) => {
    const { style } = e.detail
    editStore.setConfigBlockBy('style', style)
  }

  handlePrinterBlockTextSet = (e) => {
    const { text } = e.detail
    editStore.setConfigBlockBy('text', text)
  }

  handlePrinterTableDrag = (e) => {
    editStore.exchangeTableColumn(e.detail.target, e.detail.source)
  }

  handleKeyDown = (e) => {
    if (e.target !== window.document.body) {
      return
    }

    if (e.code.startsWith('Arrow')) {
      e.preventDefault()

      if (editStore.computedIsSelectBlock) {
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

        editStore.setConfigBlockBy('style', newStyle)
      } else if (editStore.computedIsSelectTable) {
        if (e.code === 'ArrowLeft') {
          editStore.exchangeTableColumnByDiff(-1)
        } else if (e.code === 'ArrowRight') {
          editStore.exchangeTableColumnByDiff(1)
        }
      }
    } else if (e.code === 'Escape' && editStore.selected) {
      e.preventDefault()
      editStore.setSelected(null)
    } else if (e.code === 'Backspace' && editStore.selected) {
      e.preventDefault()
      editStore.removeField()
    }
  }

  handleCancel = (e) => {
    const { selected, selectedRegion } = editStore
    // 点击区域不包含selected的时候
    if (!_.includes(selected, selectedRegion)) {
      editStore.setSelected(null)
    }
    if (e.target === e.currentTarget) {
      editStore.setSelected(null)
      editStore.setSelectedRegion(null)
    }
  }

  render () {
    return (
      <div className='gm-printer-edit'>

        <Flex className='gm-printer-edit-title-fixed'>
          <Title title='模板预览' text={<span className='gm-text-red gm-padding-left-5'>说明：选中内容进行编辑，可拖动字段移动位置，右键使用更多功能，更多详情点击
            <a href=''>查看视频教程</a>
          </span>}/>
        </Flex>

        <div className='gm-printer-edit-zone'>
          <EditorTitle data={mockData} onSave={this.handleSave}/>
          <Gap height='10px'/>
          <EditorSelect/>
          <Gap height='5px'/>
          <EditorField/>
          <Gap height='5px'/>
          <EditorAddField data={mockData}/>
        </div>

        <div className='gm-printer-edit-wrap'>
          <ContextMenu className='gm-printer-edit-content' onClick={this.handleCancel}>
            <Printer
              key={editStore.computedPrinterKey}
              selected={editStore.selected}
              selectedRegion={editStore.selectedRegion}
              config={editStore.config}
              data={mockData}
            />
          </ContextMenu>
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func
}

Editor.deaultProps = {
  onSave: _.noop
}

export default Editor
