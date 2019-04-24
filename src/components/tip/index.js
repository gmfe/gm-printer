import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { SvgInfoCircle } from 'gm-svg'
import Flex from '../flex'
import _ from 'lodash'

const tips = []

const Tip = (props) => {
  const { list } = props

  return <React.Fragment>
    {_.map(list, (item, index) => {
      return (
        <div key={index} className='gm-animated gm-animated-fade-in-right-100'>
          <Flex alignCenter className='gm-tip'>
            <SvgInfoCircle className='gm-svg-info'/>
            <div style={{ paddingLeft: '10px' }}>
              <div>{item}</div>
            </div>
          </Flex>
        </div>
      )
    })}
  </React.Fragment>
}

function getTipDOM (id) {
  return window.shadowRoot.getElementById(id)
}

Tip.warning = (message = '') => {
  tips.push(message)

  setTimeout(() => {
    tips.shift()
    ReactDOM.render(<Tip list={tips}/>, getTipDOM('gm-printer-tip'))
  }, 3000)

  ReactDOM.render(<Tip list={tips}/>, getTipDOM('gm-printer-tip'))
}

Tip.propTypes = {
  list: PropTypes.array.isRequired
}

export default Tip
