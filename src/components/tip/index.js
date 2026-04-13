import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { SvgInfoCircle } from 'gm-svg'
import Flex from '../flex'
import _ from 'lodash'

const tips = []

const Tip = props => {
  const { list } = props

  return (
    <>
      {_.map(list, (item, index) => {
        return (
          <div
            key={index}
            className='gm-animated gm-animated-fade-in-right-100'
          >
            <Flex alignCenter className='gm-tip'>
              <SvgInfoCircle className='gm-svg-info' />
              <div style={{ paddingLeft: '10px' }}>
                <div>{item}</div>
              </div>
            </Flex>
          </div>
        )
      })}
    </>
  )
}

function getTipDOM(id) {
  return window?.shadowRoot?.getElementById(id)
}

Tip.warning = (message = '') => {
  tips.push(message)

  const tipDOM = getTipDOM('gm-printer-tip')
  if (!tipDOM) {
    // 打印 iframe 场景下不存在 gm-printer-tip 容器，用 alert 兜底
    window.alert(message)
    tips.pop()
    return
  }

  setTimeout(() => {
    tips.shift()
    ReactDOM.render(<Tip list={tips} />, tipDOM)
  }, 3000)

  ReactDOM.render(<Tip list={tips} />, tipDOM)
}

Tip.propTypes = {
  list: PropTypes.array.isRequired
}

export default Tip
