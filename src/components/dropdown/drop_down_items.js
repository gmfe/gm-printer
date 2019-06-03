import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class DropDownItems extends React.Component {
  render () {
    const { children, ...rest } = this.props
    return (
      <ul
        {...rest}
        className={classNames('dropdown-menu')}
      >{children}</ul>
    )
  }
}

DropDownItems.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
}

export default DropDownItems
