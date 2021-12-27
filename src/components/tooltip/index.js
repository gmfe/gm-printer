import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SVGQuestionCircle from '../../svg/question-circle-o.svg'

const ToolTip = ({ text }) => {
  const [active, setActive] = useState(false)
  return (
    <span
      onMouseEnter={() => {
        setActive(true)
      }}
      onMouseLeave={() => {
        setActive(false)
      }}
      className='b-editor-tooltip'
    >
      {active && <span className='b-editor-tooltip-text'>{text}</span>}
      <SVGQuestionCircle />
    </span>
  )
}
ToolTip.propTypes = {
  text: PropTypes.string.isRequired
}

export default ToolTip
