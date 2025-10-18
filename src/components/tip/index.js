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
  // TODO 这里要判断是否有dom 避免报错
  setTimeout(() => {
    const dom = getTipDOM('gm-printer-tip')
    tips.shift()
    if (!dom) {
      return
    }
    ReactDOM.render(<Tip list={tips} />)
  }, 3000)
  const dom = getTipDOM('gm-printer-tip')
  if (!dom) {
    return
  }
  ReactDOM.render(<Tip list={tips} />, getTipDOM('gm-printer-tip'))
}

Tip.propTypes = {
  list: PropTypes.array.isRequired
}

export default Tip
