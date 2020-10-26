import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Flex from '../flex'
import _ from 'lodash'

const tips = []

const Tip = props => {
  const { list } = props

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

const SvgInfoCircle = props => (
  <svg
    {...props}
    width='1em'
    height='1em'
    viewBox='0 0 1024 1024'
    fill='currentColor'
    className={'gm-svg-icon ' + (props.className || '')}
  >
    <path d='M512 4.445c-276.763 0-501.095 224.331-501.095 501.094S235.237 1006.634 512 1006.634c276.763 0 501.095-224.331 501.095-501.095S788.763 4.445 512 4.445zM494.065 218.68c29.892 0 54.294 24.306 54.294 54.295s-24.305 54.197-54.295 54.197-54.295-24.305-54.295-54.295c.098-29.891 24.403-54.197 54.295-54.197zm89.479 573.716H440.458c-20.091 0-36.359-16.268-36.359-36.359s16.27-36.359 36.36-36.359h35.183V471.435H440.36c-19.993 0-36.359-16.269-36.359-36.359s16.268-36.359 36.36-36.359h72.13c19.798 0 35.772 16.073 35.772 35.771V719.68h35.282c20.091 0 36.359 16.27 36.359 36.36s-16.269 36.358-36.359 36.358z' />
  </svg>
)
function getTipDOM(id) {
  return window.shadowRoot.getElementById(id)
}

Tip.warning = (message = '') => {
  tips.push(message)

  setTimeout(() => {
    tips.shift()
    ReactDOM.render(<Tip list={tips} />, getTipDOM('gm-printer-tip'))
  }, 3000)

  ReactDOM.render(<Tip list={tips} />, getTipDOM('gm-printer-tip'))
}

Tip.propTypes = {
  list: PropTypes.array.isRequired
}

export default Tip
