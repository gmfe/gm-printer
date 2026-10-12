import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Counter from './counter'
import { inject, observer } from 'mobx-react'
import {
  dispatchMsg,
  getStyleWithDiff,
  pxAdd,
  DEFAULT_IMAGE_BLOCK_SIZE
} from '../util'
import BarCode from './barcode'
import QrCode from './qrcode'
import Tag from './tag'

// 四角缩放手柄方位：nw 左上 / ne 右上 / sw 左下 / se 右下
const RESIZE_HANDLES = ['nw', 'ne', 'sw', 'se']

@inject('printerStore')
@observer
class Block extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clientX: null,
      clientY: null,
      isEdit: false
    }
  }

  componentDidMount() {
    window.document.addEventListener(
      'gm-printer-block-edit',
      this.handleBlockEdit
    )
  }

  componentWillUnmount() {
    window.document.removeEventListener(
      'gm-printer-block-edit',
      this.handleBlockEdit
    )
    // 缩放拖拽进行中卸载时，清理 document 级监听
    this.cancelResize && this.cancelResize()
  }

  handleBlockEdit = e => {
    const { name } = this.props

    if (e.detail.name !== name) {
      return
    }

    this.setState(
      {
        isEdit: true
      },
      () => {
        this.refEdit.focus()
        this.refEdit.select()
      }
    )
  }

  handleDragStart = ({ clientX, clientY }) => {
    const { name } = this.props

    this.setState({
      clientX,
      clientY
    })
    dispatchMsg('gm-printer-select', {
      selected: name
    })
  }

  handleDragEnd = ({ clientX, clientY }) => {
    const { config } = this.props
    const diffX = clientX - this.state.clientX
    const diffY = clientY - this.state.clientY

    const style = getStyleWithDiff(config.style, diffX, diffY)

    dispatchMsg('gm-printer-block-style-set', {
      style
    })
  }

  handleClick = () => {
    const { name } = this.props

    dispatchMsg('gm-printer-select', {
      selected: name
    })
  }

  // 图片块四角等比缩放：拖动角点按初始宽高比联动宽高，对角锚定不动
  // 仅 printerStore.imageResizeEnabled（检测报告等业务）开启且图片块选中时可用
  // 注：不用库内 draggable+dragEnd 模式（如块移动/面板高度拖拽），因为缩放需要拖动
  // 过程中的实时预览；为控制整树重渲染频率，用 rAF 合帧，每帧至多派发一次
  handleResizeStart = e => {
    e.preventDefault()
    e.stopPropagation()

    const { config } = this.props
    // 方位取自手柄 data-pos，保证 handler 引用稳定，render 中无需 bind
    const position = e.currentTarget.dataset.pos
    const startWidth =
      parseFloat(config.style.width) || DEFAULT_IMAGE_BLOCK_SIZE
    const startHeight =
      parseFloat(config.style.height) || DEFAULT_IMAGE_BLOCK_SIZE
    // 锁定原始比例：高度始终按初始宽高比计算
    const ratio = startHeight / startWidth
    const startX = e.clientX
    // 拖动方向：左侧角向左拖为放大，上侧角向上拖为放大
    const isLeft = position === 'nw' || position === 'sw'
    const isTop = position === 'nw' || position === 'ne'

    // 最近一次鼠标位置 + 是否已排帧：mousemove 可能高于刷新率，合并到每帧处理一次
    let lastEv = null
    let scheduled = false

    const flush = () => {
      scheduled = false
      if (!lastEv) {
        return
      }
      let dx = lastEv.clientX - startX
      if (isLeft) {
        dx = -dx
      }
      // 最小 10px，避免缩没了
      const newWidth = Math.max(10, Math.round(startWidth + dx))
      const newHeight = Math.max(10, Math.round(newWidth * ratio))
      // 对角锚定：拖左/上角时同步平移 left/top，视觉上对角固定不动
      const style = {
        ...config.style,
        width: newWidth + 'px',
        height: newHeight + 'px',
        left: pxAdd(config.style.left, isLeft ? startWidth - newWidth : 0),
        top: pxAdd(config.style.top, isTop ? startHeight - newHeight : 0)
      }

      dispatchMsg('gm-printer-block-style-set', { style })
    }

    const handleMouseMove = ev => {
      lastEv = ev
      if (!scheduled) {
        scheduled = true
        window.requestAnimationFrame(flush)
      }
    }

    const handleMouseUp = () => {
      window.document.removeEventListener('mousemove', handleMouseMove)
      window.document.removeEventListener('mouseup', handleMouseUp)
      this.cancelResize = null
    }

    // 拖拽进行中组件卸载时，经 componentWillUnmount 调用清理
    this.cancelResize = handleMouseUp

    window.document.addEventListener('mousemove', handleMouseMove)
    window.document.addEventListener('mouseup', handleMouseUp)
  }

  handleDoubleClick = () => {
    const {
      config: { type }
    } = this.props
    if (!type || type === 'text') {
      this.setState(
        {
          isEdit: true
        },
        () => {
          this.refEdit && this.refEdit.focus()
        }
      )
    }
  }

  handleEditBlur = () => {
    this.setState({
      isEdit: false
    })
  }

  handleText = e => {
    dispatchMsg('gm-printer-block-text-set', {
      text: e.target.value
    })
  }

  render() {
    let {
      name,
      config: { type, text, link, style, subText, value },
      pageIndex,
      className,
      printerStore,
      ...rest
    } = this.props
    const { isEdit } = this.state
    let content = null
    let specialStyle = null
    if (!type || type === 'text') {
      content = printerStore.template(text, pageIndex)
    } else if (type === 'line') {
      content = null
    } else if (type === 'image') {
      // link 为写死的链接, text 为动态的链接(取接口数据里边的)
      const src = link || printerStore.template(text)
      content = (
        <img
          src={src}
          style={{
            width: '100%',
            height: '100%'
          }}
          alt=''
          data-name={name}
        />
      )
    } else if (type === 'counter') {
      // 🌡特殊处理: counter层级(9) 比 普通block层级(10)低. 为了让普通block被选中
      specialStyle = { zIndex: 9 }
      content = <Counter value={value} />
      name = `${name}.counter`
    } else if (type === 'tag') {
      // 🌡特殊处理: counter层级(9) 比 普通block层级(10)低. 为了让普通block被选中
      specialStyle = { zIndex: 9 }
      content = <Tag value={value} />
      name = `${name}.tag`
    } else if (type === 'split_order_title') {
      // ⛑‍分单打印时,特殊的标题(由station的order_print的splitOrder函数修改config)
      content = (
        <div>
          {printerStore.template(text, pageIndex)}
          <span style={{ fontWeight: 'normal' }}>{subText}</span>
        </div>
      )
    } else if (type === 'barcode') {
      // sid 合并打印没有订单id值，所以不渲染条形码
      if (printerStore.template(text)) {
        content = (
          <BarCode
            value={printerStore.template(text)}
            textMargin={0}
            margin={0}
            height={35}
            width={2}
            displayValue={false}
            dataName={name}
            background='transparent'
          />
        )
      }
    } else if (type === 'qrcode') {
      content = (
        <QrCode
          value={printerStore.template(text)}
          size={parseInt(style.height)}
        />
      )
    }

    const active = name === printerStore.selected
    // 图片块选中且业务开启 imageResize 时展示四角等比缩放手柄（打印无选中态，不会渲染）
    const showResizeHandles =
      active && type === 'image' && printerStore.imageResizeEnabled

    return (
      <div
        style={{ ...style, ...specialStyle }}
        className={classNames('gm-printer-block', className, {
          active
        })}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        {...rest}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            left: '0',
            top: '0',
            width: '100%',
            height: '100%'
          }}
          data-name={name}
        />
        {(!type || type === 'text') && active && isEdit && (
          <textarea
            ref={ref => (this.refEdit = ref)}
            className='gm-printer-block-text-edit'
            value={text}
            onChange={this.handleText}
            onBlur={this.handleEditBlur}
          />
        )}
        {content}
        {/* 四角等比缩放手柄：方位见 RESIZE_HANDLES，位置经 data-pos 传给 handler */}
        {showResizeHandles &&
          RESIZE_HANDLES.map(pos => (
            <div
              key={pos}
              data-pos={pos}
              className={`gm-printer-block-resize gm-printer-block-resize-${pos}`}
              onMouseDown={this.handleResizeStart}
            />
          ))}
      </div>
    )
  }
}

Block.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  printerStore: PropTypes.object
}

export default Block
