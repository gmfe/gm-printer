import i18next from '../../locales'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { tableClassNameList, longPrintTableClassNameList, LONG_PRINT } from '../config'
import _ from 'lodash'
import { Hr, ImageUploader } from '../common/component'
import { observer, inject } from 'mobx-react'

@inject('editStore')
@observer
class CommonContextMenu extends React.Component {
  constructor(props) {
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

    this.menuRef = React.createRef()
  }

  componentDidMount() {
    window.shadowRoot.addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    window.shadowRoot.removeEventListener('click', this.handleClick)
  }

  handleClick = e => {
    // 简单处理,点击空白收起context_menu
    if (
      e.target.parentNode &&
      e.target.parentNode.className === 'gm-printer-edit-contextmenu'
    ) {
      return
    }

    this.setState({
      name: null
    })
  }

  handleCancel = e => {
    const { editStore } = this.props
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

  handleChangeCounterDataKey = field => {
    const { editStore } = this.props
    const { name } = this.state
    const { setCounter } = editStore
    setCounter(field, name)
  }

  handleContextMenu = e => {
    const {
      target: {
        dataset: { name }
      },
      clientX,
      clientY
    } = e
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
    const { editStore } = this.props
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
    const { editStore } = this.props
    const { name } = this.state
    editStore.removeContent(name)

    this.setState({
      name: null
    })
  }

  handleAddContent = (diff, type) => {
    const { editStore } = this.props
    const { name } = this.state

    editStore.addContentByDiff(name, diff, type)

    this.setState({
      name: null
    })
  }

  handleInsertImage = imgURL => {
    this.handleInsertBlock('image', imgURL)
  }

  handleRemove = () => {
    const { editStore } = this.props
    const { name } = this.state

    editStore.setSelected(name)
    editStore.removeField()

    this.setState({
      name: null
    })
  }

  handleSetTableConfig(value) {
    const { editStore } = this.props
    editStore.setConfigTableBy(this.state.name, 'className', value)
    this.setState({
      name: null
    })
  }

  detectContextMenuTop = () => {
    const {
      popup: { top }
    } = this.state
    const clientHeight = window.document.body.clientHeight
    const contextMenuHeight = this.menuRef.current.clientHeight
    if (clientHeight - top < contextMenuHeight) {
      this.setState({
        popup: {
          ...this.state.popup,
          top: clientHeight - contextMenuHeight
        }
      })
    }
  }

  renderColumn = () => {
    const { editStore, renderTableAction } = this.props
    const { name } = this.state
    const arr = name.split('.')
    const { className } = editStore.config.contents[arr[2]]
    const isActive = c => className === c
    const { config } = editStore
    const isLongPrint = config?.page?.type === LONG_PRINT
    return (
      <>
        {renderTableAction && (
          <>
            {renderTableAction && renderTableAction(name)}
            <Hr />
          </>
        )}

        <div onClick={this.handleRemove}>{i18next.t('移除列')}</div>
        <Hr />

        {!isLongPrint && (
          <>
            {' '}
            {_.map(tableClassNameList, o => (
              <div
                onClick={this.handleSetTableConfig.bind(this, o.value)}
                key={o.value}
                className={isActive(o.value) ? 'active' : ''}
              >
                {o.text}
              </div>
            ))}{' '}
            <Hr />
          </>
        )}

        {isLongPrint && (
          <>
            {' '}
            {_.map(longPrintTableClassNameList, o => (
              <div
                onClick={this.handleSetTableConfig.bind(this, o.value)}
                key={o.value}
                className={isActive(o.value) ? 'active' : ''}
              >
                {o.text}
              </div>
            ))}{' '}
            <Hr />
          </>)
        }

        <div onClick={this.handleAddContent.bind(this, 0, '')}>
          {i18next.t('向上插入区域块')}
        </div>
        <div onClick={this.handleAddContent.bind(this, 1, '')}>
          {i18next.t('向下插入区域块')}
        </div>
        <div onClick={this.handleRemoveContent}>{i18next.t('移除区域')}</div>

        <Hr />
        <div onClick={this.handleAddContent.bind(this, 0, 'table')}>
          {i18next.t('向上插入表格')}
        </div>
        <div onClick={this.handleAddContent.bind(this, 1, 'table')}>
          {i18next.t('向下插入表格')}
        </div>
      </>
    )
  }

  renderCounterMenu = () => {
    const { editStore } = this.props
    const { name } = this.state
    const arr = (name && name.split('.')) || []
    let { value } = editStore.config.contents[arr[2]].blocks[arr[4]]

    // 兼容之前版本
    if (value === undefined) value = ['len']

    const isProductLengthActive = _.includes(value, 'len')
    const isSubtotalActive = _.includes(value, 'subtotal')
    return (
      <>
        <div
          onClick={this.handleChangeCounterDataKey.bind(this, 'len')}
          className={isProductLengthActive ? 'active' : ''}
        >
          {i18next.t('商品数')}
        </div>
        <div
          onClick={this.handleChangeCounterDataKey.bind(this, 'subtotal')}
          className={isSubtotalActive ? 'active' : ''}
        >
          {i18next.t('小计')}
        </div>
        <Hr />
        <div onClick={this.handleRemoveContent}>{i18next.t('移除区域')}</div>
      </>
    )
  }

  renderBlock = () => {
    return <div onClick={this.handleRemove}>{i18next.t('移除')}</div>
  }

  renderPanel = () => {
    let { insertBlockList } = this.props
    const { name } = this.state
    const arr = name.split('.')
    const type = arr[0]

    // 页眉 页脚 签名 不添加分类汇总
    if (type === 'header' || type === 'sign' || type === 'footer') {
      insertBlockList = _.filter(
        insertBlockList,
        item => item.value !== 'counter'
      )
    }

    return (
      <>
        {_.map(insertBlockList, v => {
          return v.value === 'image' ? (
            <ImageUploader
              onSuccess={this.handleInsertImage}
              key={v.value}
              text={v.text}
            />
          ) : (
            <div
              key={v.value}
              onClick={this.handleInsertBlock.bind(this, v.value)}
            >
              {v.text}
            </div>
          )
        })}

        {arr[0] === 'contents' && (
          <>
            <Hr />
            <div onClick={this.handleAddContent.bind(this, 0, '')}>
              {i18next.t('向上插入区域块')}
            </div>
            <div onClick={this.handleAddContent.bind(this, 1, '')}>
              {i18next.t('向下插入区域块')}
            </div>
            <div onClick={this.handleRemoveContent}>
              {i18next.t('移除区域')}
            </div>
            <Hr />
            <div onClick={this.handleAddContent.bind(this, 0, 'table')}>
              {i18next.t('向上插入表格')}
            </div>
            <div onClick={this.handleAddContent.bind(this, 1, 'table')}>
              {i18next.t('向下插入表格')}
            </div>
          </>
        )}
      </>
    )
  }

  render() {
    const { children } = this.props
    const { name, popup } = this.state
    const arr = (name && name.split('.')) || []

    return (
      <div
        onClick={this.handleCancel}
        className='gm-printer-edit-content'
        onContextMenu={this.handleContextMenu}
      >
        {children}
        {name && (
          <Menu detectContextMenuTop={this.detectContextMenuTop}>
            <div
              ref={this.menuRef}
              className='gm-printer-edit-contextmenu'
              style={{
                position: 'fixed',
                ...popup
              }}
            >
              {arr.length === 1 && this.renderPanel()}
              {arr.length === 3 && arr[1] === 'panel' && this.renderPanel()}
              {arr.length === 3 && arr[1] === 'block' && this.renderBlock()}
              {arr.length === 5 && arr[3] === 'block' && this.renderBlock()}
              {arr.length === 5 && arr[1] === 'table' && this.renderColumn()}
              {arr.length === 6 &&
                arr[5] === 'counter' &&
                this.renderCounterMenu()}
            </div>
          </Menu>
        )}
      </div>
    )
  }
}

function Menu(props) {
  const { detectContextMenuTop, children } = props
  useEffect(() => {
    detectContextMenuTop()
  })

  return <>{children}</>
}

Menu.propTypes = {
  children: PropTypes.element.isRequired,
  detectContextMenuTop: PropTypes.func.isRequired
}

CommonContextMenu.propTypes = {
  editStore: PropTypes.object,
  insertBlockList: PropTypes.array.isRequired,
  renderTableAction: PropTypes.func,
  children: PropTypes.element.isRequired
}

export default CommonContextMenu
