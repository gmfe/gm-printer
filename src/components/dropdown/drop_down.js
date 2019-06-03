import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { findDOMNode } from 'react-dom'
import { contains } from 'gm-util'

class DropDown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount () {
    window.shadowRoot.addEventListener('click', this.handleBodyClick)
  }

  componentWillUnmount () {
    window.shadowRoot.removeEventListener('click', this.handleBodyClick)
  }

  handleBodyClick = (e) => {
    const target = e.target
    const selectDOM = findDOMNode(this)
    if (this.state.show && !contains(selectDOM, target)) {
      this.setState({ show: false })
    }
  }

  render () {
    const {
      children,
      popup,
      ...rest
    } = this.props

    const { show } = this.state
    return (
      <div
        {...rest}
        style={{ width: '30px' }}
        className={classNames('gm-select', { 'gm-select-open': show })}
      >
        {children}
        <button
          type='button'
          onClick={() => { this.setState({ show: !show }) }}
          className={classNames('btn btn-default dropdown-toggle')}
        >
          <span className='caret'/>
        </button>
        <div key='list' className='gm-select-list gm-animated gm-animated-fade-in-right'>
          {popup}
        </div>
      </div>
    )
  }
}

DropDown.propTypes = {
  popup: PropTypes.element.isRequired,
  children: PropTypes.any,
  style: PropTypes.object
}

export default DropDown
