import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import './style.less'
class Radio extends React.Component {
  render() {
    const {
      value,
      checked,
      onChange,
      onClick,
      children,
      inline,
      block,
      name,
      disabled,
      className,
      ...rest
    } = this.props

    const inner = (
      <label
        {...rest}
        className={classNames(
          'gm-radio',
          {
            'gm-radio-inline': inline,
            'gm-radio-block': block,
            disabled
          },
          className
        )}
      >
        <input
          type='radio'
          className='gm-radio-input'
          name={name}
          value={value}
          checked={checked || false}
          onChange={onChange}
          onClick={onClick}
          disabled={disabled}
        />
        <span className='gm-radio-span' />
        {children}
      </label>
    )

    if (!inline) {
      return <div>{inner}</div>
    }
    return inner
  }
}

Radio.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.any,
  children: PropTypes.any,
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  block: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
}

Radio.defaultProps = {
  onChange: _.noop,
  onClick: _.noop
}

export default Radio
