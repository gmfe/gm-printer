import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import { blockTypeList, tableClassNameList } from '../config'
import editStore from './store'
import _ from 'lodash'
import { Hr, ImageUploader } from './component'

/**
 * 是否存在每页合计按钮,非异常明细才有按钮
 * @param name => ContextMenu 的 this.state.name
 * @return {boolean}
 */
function hasSubtotalBtn (name) {
  if (!name) return false

  const arr = name.split('.')
  if (_.includes(arr, 'table')) {
    const dataKey = editStore.config.contents[arr[2]].dataKey
    // 异常明细没有每页小计
    return dataKey !== 'abnormal'
  }
}

class ContextMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: null,
      popup: {
        left: 0,
        top: 0
      },
      block: {
        left: 0,
        top: 0
      }
    }
  }

  componentDidMount () {
    window.document.addEventListener('click', this.handleClick)
  }

  componentWillUnmount () {
    window.document.removeEventListener('click', this.handleClick)
  }

  handleClick = (e) => {
    // 简单处理,点击空白收起context_menu
    if (e.target.parentNode && e.target.parentNode.className === 'gm-printer-edit-contextmenu') {
      return
    }

    this.setState({
      name: null
    })
  }

  handleContextMenu = (e) => {
    const { target: { dataset: { name } }, clientX, clientY } = e
    console.log(name)

    if (!name) {
      return
    }

    // name
    // header
    // header.block.0
    // contents.panel.0
    // contents.panel.0.block.0
    // contents.table.0
    // contents.table.0.column.0

    e.preventDefault()

    const rect = e.target.getBoundingClientRect()

    this.setState({
      name,
      popup: {
        left: clientX,
        top: clientY
      },
      block: {
        left: clientX - rect.x,
        top: clientY - rect.y
      }
    })
  }

  handleInsertBlock = (type, link) => {
    const { name, block } = this.state

    editStore.addConfigBlock(
      name,
      type,
      {
        left: block.left + 'px',
        top: block.top + 'px'
      },
      link
    )

    this.setState({
      name: null
    })
  }

  handleRemoveContent = () => {
    const { name } = this.state
    editStore.removeContent(name)

    this.setState({
      name: null
    })
  }

  handleSubtotal = () => {
    const { name } = this.state

    editStore.setSubtotalShow(name)
  }

  handleAddContent = (diff, type) => {
    const { name } = this.state

    editStore.addContentByDiff(name, diff, type)

    this.setState({
      name: null
    })
  }

  handleInsertImage = (imgURL) => {
    this.handleInsertBlock('image', imgURL)
  }

  renderPanel () {
    const { name } = this.state
    const arr = name.split('.')

    return (
      <React.Fragment>
        {_.map(blockTypeList, v => (
          v.value === 'image'
            ? <ImageUploader onSuccess={this.handleInsertImage} key={v.value} text={v.text}/>
            : <div key={v.value} onClick={this.handleInsertBlock.bind(this, v.value)}>{v.text}</div>
        ))}

        {arr[0] === 'contents' && (
          <React.Fragment>
            <Hr/>
            <div onClick={this.handleAddContent.bind(this, 0, '')}>{i18next.t('向上插入区域块')}</div>
            <div onClick={this.handleAddContent.bind(this, 1, '')}>{i18next.t('向下插入区域块')}</div>
            <div onClick={this.handleRemoveContent}>{i18next.t('移除区域')}</div>
            <Hr/>
            <div onClick={this.handleAddContent.bind(this, 0, 'table')}>{i18next.t('向上插入表格')}</div>
            <div onClick={this.handleAddContent.bind(this, 1, 'table')}>{i18next.t('向下插入表格')}</div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  handleRemove = () => {
    const { name } = this.state

    editStore.setSelected(name)
    editStore.removeField()

    this.setState({
      name: null
    })
  }

  renderBlock () {
    return (
      <div onClick={this.handleRemove}>
        {i18next.t('移除')}
      </div>
    )
  }

  handleChangeTableDataKey = (key) => {
    const { name } = this.state
    editStore.changeTableDataKey(name, key)
  }

  renderOrderActionBtn = () => {
    const { name } = this.state
    if (!hasSubtotalBtn(name)) {
      return null
    }

    const arr = name.split('.')
    const { dataKey, subtotal } = editStore.config.contents[arr[2]]
    const keyArr = dataKey.split('_')

    const isMultiActive = keyArr.includes('multi')
    const isCategoryActive = keyArr.includes('category')
    const isSubtotalActive = subtotal.show

    return (
      <React.Fragment>
        <div onClick={this.handleChangeTableDataKey.bind(this, 'multi')}
          className={isMultiActive ? 'active' : ''}>{i18next.t('双栏商品')}
        </div>
        <div onClick={this.handleChangeTableDataKey.bind(this, 'category')}
          className={isCategoryActive ? 'active' : ''}>{i18next.t('商品分类')}
        </div>
        <div onClick={this.handleSubtotal} className={isSubtotalActive ? 'active' : ''}>{i18next.t('每页合计')}</div>
      </React.Fragment>
    )
  }

  handleSetTableConfig (value) {
    editStore.setConfigTableBy(this.state.name, 'className', value)
  }

  renderColumn () {
    const arr = this.state.name.split('.')
    const { className } = editStore.config.contents[arr[2]]
    const isActive = c => className === c

    return (
      <React.Fragment>
        {this.renderOrderActionBtn()}

        <Hr/>
        <div onClick={this.handleRemove}>{i18next.t('移除列')}</div>

        <Hr/>
        {_.map(tableClassNameList, o => (
          <div onClick={this.handleSetTableConfig.bind(this, o.value)} key={o.value}
            className={isActive(o.value) ? 'active' : ''}>{o.text}</div>
        ))}

        <Hr/>
        <div onClick={this.handleAddContent.bind(this, 0, '')}>{i18next.t('向上插入区域块')}</div>
        <div onClick={this.handleAddContent.bind(this, 1, '')}>{i18next.t('向下插入区域块')}</div>
        <div onClick={this.handleRemoveContent}>{i18next.t('移除区域')}</div>

        <Hr/>
        <div onClick={this.handleAddContent.bind(this, 0, 'table')}>{i18next.t('向上插入表格')}</div>
        <div onClick={this.handleAddContent.bind(this, 1, 'table')}>{i18next.t('向下插入表格')}</div>
      </React.Fragment>
    )
  }

  render () {
    const { children, ...rest } = this.props
    const { name, popup } = this.state
    const arr = (name && name.split('.')) || []

    return (
      <div {...rest} onContextMenu={this.handleContextMenu}>
        {children}
        {name && (
          <div className='gm-printer-edit-contextmenu' style={{
            position: 'fixed',
            ...popup
          }}>
            {arr.length === 1 && this.renderPanel()}
            {arr.length === 3 && arr[1] === 'panel' && this.renderPanel()}
            {arr.length === 3 && arr[1] === 'block' && this.renderBlock()}
            {arr.length === 5 && arr[3] === 'block' && this.renderBlock()}
            {arr.length === 5 && arr[1] === 'table' && this.renderColumn()}
          </div>
        )}
      </div>
    )
  }
}

ContextMenu.propTypes = {
  children: PropTypes.element.isRequired
}

export default ContextMenu
