import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { fontSizeList, borderStyleList } from '../util'

class Separator extends React.Component {
  render () {
    return (
      <span style={{
        display: 'inline-block',
        margin: '0 8px',
        borderLeft: '1px solid #c1c8cc',
        height: '1em'
      }}/>
    )
  }
}

class Text extends React.Component {
  handleChange = (e) => {
    const {onChange} = this.props
    onChange(e.target.value)
  }

  render () {
    const {disabled, value, placeholder, style} = this.props
    return (
      <input
        disabled={disabled}
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        style={style}
      />
    )
  }
}

Text.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

// 10px => 10  10% => 10%
class TextPX extends React.Component {
  handleChange = (value) => {
    const {onChange} = this.props
    if (value === '') {
      onChange('')
    } else if (value.endsWith('%')) {
      onChange(value)
    } else {
      onChange(value + 'px')
    }
  }

  render () {
    const {disabled, value = '', block} = this.props

    let nValue = value
    if (value.endsWith('px')) {
      nValue = value.replace(/px/g, '')
    }

    return (
      <Text disabled={disabled} block={block} value={nValue} onChange={this.handleChange} style={{width: '35px'}}/>
    )
  }
}

TextPX.propTypes = {
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

class Fonter extends React.Component {
  handleChange = (type, value) => {
    const {style, onChange} = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const {style} = this.props

    return (
      <span className='gm-printer-edit-fonter'>
        <select value={style.fontSize || '14px'} onChange={e => this.handleChange('fontSize', e.target.value)}>
          {_.map(fontSizeList, v => <option key={v} value={v}>{v.slice(0, -2)}</option>)}
        </select>
        <Separator/>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: style.fontWeight === 'bold'
          })}
          style={{fontWeight: 'bold'}}
          onClick={() => this.handleChange('fontWeight', style.fontWeight === 'bold' ? '' : 'bold')}
        >
          B
        </span>
        <span
          className={classNames('gm-printer-edit-btn', {active: style.fontStyle === 'italic'})}
          style={{fontStyle: 'italic'}}
          onClick={() => this.handleChange('fontStyle', style.fontStyle === 'italic' ? '' : 'italic')}
        >
          I
        </span>
        <span
          className={classNames('gm-printer-edit-btn', {active: style.textDecoration === 'underline'})}
          style={{textDecoration: 'underline'}}
          onClick={() => this.handleChange('textDecoration', style.textDecoration === 'underline' ? '' : 'underline')}
        >
          U
        </span>
      </span>
    )
  }
}

Fonter.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

class TextAlign extends React.Component {
  handleChange = (textAlign) => {
    const {style, onChange} = this.props
    onChange({
      ...style,
      textAlign
    })
  }

  render () {
    const {style: {textAlign}} = this.props

    // TODO
    return (
      <span className='gm-printer-edit-text-align'>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'left'
          })}
          onClick={() => this.handleChange('left')}
        >居左</span>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'center'
          })}
          onClick={() => this.handleChange('center')}
        >居中</span>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'right'
          })}
          onClick={() => this.handleChange('right')}
        >居右</span>
      </span>
    )
  }
}

TextAlign.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

class Position extends React.Component {
  handleChange = (type, value) => {
    const {style, onChange} = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const {style: {top, right, bottom, left}} = this.props

    return (
      <span>
        上 <TextPX value={top} onChange={this.handleChange.bind(this, 'top')}/>
        &nbsp;
        左 <TextPX value={left} onChange={this.handleChange.bind(this, 'left')}/>
        &nbsp;
        下 <TextPX value={bottom} onChange={this.handleChange.bind(this, 'bottom')}/>
        &nbsp;
        右 <TextPX value={right} onChange={this.handleChange.bind(this, 'right')}/>
      </span>
    )
  }
}

Position.propTypes = {
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

class Line extends React.Component {
  handleChange = (type, value) => {
    const {style, onChange} = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const {style: {borderTopWidth, borderTopStyle, width}} = this.props

    // TODO 横竖线  type select
    return (
      <span>
        宽 <TextPX value={width} onChange={this.handleChange.bind(this, 'width')} style={{width: '35px'}}/>
        &nbsp;
        粗细 <TextPX value={borderTopWidth} onChange={this.handleChange.bind(this, 'borderTopWidth')}/>
        &nbsp;
        <select value={borderTopStyle} onChange={e => this.handleChange('borderTopStyle', e.target.value)}>
          {_.map(borderStyleList, v => <option key={v.value} value={v.value}>{v.text}</option>)}</select>
      </span>
    )
  }
}

Line.propTypes = {
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

class Size extends React.Component {
  handleChange = (type, value) => {
    const {onChange, style} = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const {style} = this.props
    return (
      <React.Fragment>
        高 <TextPX value={style.height} onChange={this.handleChange.bind(this, 'height')}/>
        &nbsp;
        宽 <TextPX value={style.width} onChange={this.handleChange.bind(this, 'width')}/>
      </React.Fragment>
    )
  }
}

Size.propTypes = {
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export {
  TextAlign,
  Separator,
  Fonter,
  Position,
  Text,
  Line,
  Size
}
