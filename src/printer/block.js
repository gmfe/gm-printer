import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Counter from './counter'
import { inject, observer } from 'mobx-react'
import { dispatchMsg, getStyleWithDiff } from '../util'
import BarCode from './barcode'
import QrCode from './qrcode'
import Tag from './tag'

// editStore 用函数形式注入:打印态(do_print 的 iframe)没有 editStore Provider,
// 字符串形式的 inject 会直接抛错,这里降级为 null 关闭编辑能力
@inject(({ printerStore, editStore }) => ({
  printerStore,
  editStore: editStore || null
}))
@observer
class Block extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clientX: null,
      clientY: null,
      isEdit: false,
      isResizing: false
    }
    this.resizeState = null
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
    this.teardownResize()
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

  // 电子签章:图片四角等比例拖拽缩放
  handleResizeStart = (direction, e) => {
    // 阻止触发块的选中/拖动
    e.stopPropagation()
    e.preventDefault()

    const {
      config: { style, ratio }
    } = this.props

    const initW = parseFloat(style.width) || 0
    const initH = parseFloat(style.height) || 0
    // 旧模板无 ratio 时按当前显示宽高锁定;宽或高缺失(存量块无 width)时退回 1,
    // 避免比例算出 0 导致高度 Infinity
    const fallbackRatio = initW > 0 && initH > 0 ? initW / initH : 1
    this.resizeState = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initW,
      initH,
      initL: parseFloat(style.left) || 0,
      initT: parseFloat(style.top) || 0,
      // ratio = 原始宽/高
      ratio: ratio || fallbackRatio,
      baseStyle: style
    }

    this.setState({
      isResizing: true
    })

    window.addEventListener('mousemove', this.handleResizeMove)
    window.addEventListener('mouseup', this.handleResizeEnd)
  }

  handleResizeMove = e => {
    if (!this.resizeState) return

    // rAF 节流,避免高频 mousemove 打爆渲染
    if (this.resizePending) return
    this.resizePending = e
    window.requestAnimationFrame(() => {
      const evt = this.resizePending
      this.resizePending = null
      if (!evt || !this.resizeState) return
      this.doResize(evt)
    })
  }

  doResize = e => {
    const {
      direction,
      startX,
      initW,
      initH,
      initL,
      initT,
      ratio,
      baseStyle
    } = this.resizeState
    const dx = e.clientX - startX

    // 右侧角向右放大,左侧角向左放大
    let width =
      direction === 'rb' || direction === 'rt' ? initW + dx : initW - dx
    // 最小尺寸兜底,防止翻转
    width = Math.max(width, 10)
    const height = Math.round(width / ratio)
    width = Math.round(width)

    // 锚定对角:左向角拖拽时右/下边不动,上向角拖拽时下边不动
    let left = initL
    let top = initT
    if (direction === 'lb' || direction === 'lt') {
      left = initL + initW - width
    }
    if (direction === 'rt' || direction === 'lt') {
      top = initT + initH - height
    }

    dispatchMsg('gm-printer-block-style-set', {
      style: {
        ...baseStyle,
        width: width + 'px',
        height: height + 'px',
        left: left + 'px',
        top: top + 'px'
      }
    })
  }

  handleResizeEnd = () => {
    // 先 flush 掉节流里排队中的最后一帧,避免松手回退
    if (this.resizePending) {
      const evt = this.resizePending
      this.resizePending = null
      this.doResize(evt)
    }
    this.teardownResize()
    this.setState({
      isResizing: false
    })
  }

  teardownResize = () => {
    window.removeEventListener('mousemove', this.handleResizeMove)
    window.removeEventListener('mouseup', this.handleResizeEnd)
    this.resizeState = null
    this.resizePending = null
  }

  render() {
    let {
      name,
      config: { type, text, link, style, subText, value },
      pageIndex,
      className,
      printerStore,
      editStore,
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
    const { isResizing } = this.state
    const showResizeHandles = !!(
      active &&
      type === 'image' &&
      editStore &&
      editStore.imageConfig &&
      editStore.imageConfig.resizable
    )

    return (
      <div
        style={{ ...style, ...specialStyle }}
        className={classNames('gm-printer-block', className, {
          active
        })}
        draggable={!isResizing}
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
        {showResizeHandles && (
          <>
            <div
              className='gm-printer-resize-handle gm-printer-resize-lt'
              onMouseDown={this.handleResizeStart.bind(this, 'lt')}
            />
            <div
              className='gm-printer-resize-handle gm-printer-resize-rt'
              onMouseDown={this.handleResizeStart.bind(this, 'rt')}
            />
            <div
              className='gm-printer-resize-handle gm-printer-resize-lb'
              onMouseDown={this.handleResizeStart.bind(this, 'lb')}
            />
            <div
              className='gm-printer-resize-handle gm-printer-resize-rb'
              onMouseDown={this.handleResizeStart.bind(this, 'rb')}
            />
          </>
        )}
      </div>
    )
  }
}

Block.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  printerStore: PropTypes.object,
  editStore: PropTypes.object
}

export default Block
