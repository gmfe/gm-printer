import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import SVGQuestionCircle from '../../svg/question-circle-o.svg'

// 与 style.less 中 .b-editor-tooltip-text 的 width 一致（border-box），用于水平夹取
const POPUP_WIDTH = 320
// 弹层与视口边缘的最小间距
const EDGE_GAP = 8

const ToolTip = ({ text }) => {
  // pos 非 null 即展示弹层。弹层用 fixed 定位：编辑器侧栏等窄容器存在 overflow 裁剪，
  // absolute 会被截断（见 TAPD 1057867），fixed 可脱离裁剪并保证不超出视口
  const [pos, setPos] = useState(null)
  const iconRef = useRef(null)

  const handleMouseEnter = () => {
    const el = iconRef.current
    if (!el) {
      return
    }
    const rect = el.getBoundingClientRect()
    const viewportWidth = document.documentElement.clientWidth
    // 默认弹层水平居中于 icon，超出视口时夹取到边缘内
    const centeredLeft = rect.left + rect.width / 2 - POPUP_WIDTH / 2
    const left = Math.max(
      EDGE_GAP,
      Math.min(centeredLeft, viewportWidth - POPUP_WIDTH - EDGE_GAP)
    )
    setPos({ left, top: rect.bottom + 6 })
  }

  return (
    <span
      ref={iconRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
      className='b-editor-tooltip'
    >
      {pos && (
        <span
          className='b-editor-tooltip-text'
          style={{ left: pos.left, top: pos.top }}
        >
          {text}
        </span>
      )}
      <SVGQuestionCircle />
    </span>
  )
}
ToolTip.propTypes = {
  text: PropTypes.string.isRequired
}

export default ToolTip
