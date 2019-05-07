import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { borderStyleList, fontSizeList } from '../config'
import { Flex, Tip } from '../components'
import { Request } from 'gm-util'
import i18next from '../../locales'
import { SvgBill } from 'gm-svg'

class IconAlign extends React.Component {
  render () {
    const style = {
      display: 'block',
      background: 'black',
      width: '100%',
      height: '1px',
      marginBottom: '1px'
    }

    return (
      <span style={{
        display: 'inline-flex',
        width: '1em',
        verticalAlign: 'middle',
        flexDirection: 'column',
        alignItems: ({ left: 'flex-start', center: 'center', right: 'flex-end' })[this.props.textAlign]
      }}>
        <span style={{ ...style }}/>
        <span style={{ ...style, width: '60%' }}/>
        <span style={{ ...style }}/>
        <span style={{ ...style, width: '60%' }}/>
        <span style={{ ...style }}/>
      </span>
    )
  }
}

IconAlign.propTypes = {
  textAlign: PropTypes.string
}

IconAlign.defaultProps = {
  textAlign: 'left'
}

class Separator extends React.Component {
  render () {
    return (
      <span style={{
        display: 'inline-block',
        margin: '0 5px',
        borderLeft: '1px solid #c1c8cc',
        height: '1em',
        verticalAlign: 'middle'
      }}/>
    )
  }
}

class Text extends React.Component {
  handleChange = (e) => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  render () {
    const { value, placeholder, style, className } = this.props
    return (
      <input
        className={classNames('gm-printer-edit-input', className)}
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
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

class Textarea extends React.Component {
  handleChange = (e) => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  render () {
    const { value, placeholder, style } = this.props
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        style={{
          width: '100%',
          ...style
        }}
      />
    )
  }
}

Textarea.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

// 10px => 10  10% => 10%
class TextPX extends React.Component {
  handleChange = (value) => {
    const { onChange } = this.props
    if (value === '') {
      onChange('')
    } else if (value.endsWith('%')) {
      onChange(value)
    } else {
      onChange(value + 'px')
    }
  }

  render () {
    const { value = '' } = this.props

    let nValue = value
    if (value.endsWith('px')) {
      nValue = value.replace(/px/g, '')
    }

    return (
      <Text value={nValue} onChange={this.handleChange} style={{ width: '35px' }}/>
    )
  }
}

TextPX.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

class Fonter extends React.Component {
  handleChange = (type, value) => {
    const { style, onChange } = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const { style } = this.props

    return (
      <span className='gm-printer-edit-fonter'>
        <select value={style.fontSize || '12px'} onChange={e => this.handleChange('fontSize', e.target.value)}>
          {_.map(fontSizeList, v => <option key={v} value={v}>{v.slice(0, -2)}</option>)}
        </select>
        <Separator/>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: style.fontWeight === 'bold'
          })}
          style={{ fontWeight: 'bold' }}
          onClick={() => this.handleChange('fontWeight', style.fontWeight === 'bold' ? '' : 'bold')}
        >
          B
        </span>
        <span
          className={classNames('gm-printer-edit-btn', { active: style.fontStyle === 'italic' })}
          style={{ fontStyle: 'italic' }}
          onClick={() => this.handleChange('fontStyle', style.fontStyle === 'italic' ? '' : 'italic')}
        >
          I
        </span>
        <span
          className={classNames('gm-printer-edit-btn', { active: style.textDecoration === 'underline' })}
          style={{ textDecoration: 'underline' }}
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
    const { style, onChange } = this.props
    onChange({
      ...style,
      textAlign
    })
  }

  render () {
    const { style: { textAlign } } = this.props

    return (
      <span className='gm-printer-edit-text-align'>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'left'
          })}
          onClick={() => this.handleChange('left')}
        ><IconAlign textAlign='left'/></span>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'center'
          })}
          onClick={() => this.handleChange('center')}
        ><IconAlign textAlign='center'/></span>
        <span
          className={classNames('gm-printer-edit-btn', {
            active: textAlign === 'right'
          })}
          onClick={() => this.handleChange('right')}
        ><IconAlign textAlign='right'/></span>
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
    const { style, onChange } = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const { style: { top, right, bottom, left } } = this.props

    return (
      <span>
        {i18next.t('上')} <TextPX value={top} onChange={this.handleChange.bind(this, 'top')}/>&nbsp;
        {i18next.t('左')}<TextPX value={left} onChange={this.handleChange.bind(this, 'left')}/>&nbsp;
        {i18next.t('下')} <TextPX value={bottom} onChange={this.handleChange.bind(this, 'bottom')}/>&nbsp;
        {i18next.t('右')} <TextPX value={right} onChange={this.handleChange.bind(this, 'right')}/>
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
    const { style, onChange } = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const { style: { borderTopWidth, borderTopStyle, width } } = this.props

    return (
      <span>
        {i18next.t('宽')}
        <TextPX value={width} onChange={this.handleChange.bind(this, 'width')} style={{ width: '35px' }}/>&nbsp;
        {i18next.t('粗细')}
        <TextPX value={borderTopWidth} onChange={this.handleChange.bind(this, 'borderTopWidth')}/>
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
    const { onChange, style } = this.props

    onChange({
      ...style,
      [type]: value
    })
  }

  render () {
    const { style } = this.props
    return (
      <React.Fragment>
        {i18next.t('高')}
        <TextPX value={style.height} onChange={this.handleChange.bind(this, 'height')}/>
        &nbsp;{i18next.t('宽')}
        <TextPX value={style.width} onChange={this.handleChange.bind(this, 'width')}/>
      </React.Fragment>
    )
  }
}

Size.propTypes = {
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

class ImageUploader extends React.Component {
  constructor () {
    super()
    this.input = React.createRef()
  }

  handleUpload = (event) => {
    event.preventDefault()
    // 只上传单张图片
    const droppedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files
    const file = droppedFiles[0]

    if (file.size > 512 * 1024) {
      Tip.warning(i18next.t('图片大小不能超过500Kb'))
      return
    }

    Request('/station/image/upload').data({
      image_file: file
    }).post().then((json) => {
      const imgURL = `http://img.guanmai.cn/station_pic/${json.data.img_path_id}`
      this.props.onSuccess(imgURL)
    })
  }

  handleClick = () => {
    this.input.current.value = null
    this.input.current.click()
  }

  render () {
    return <React.Fragment>
      <div onClick={this.handleClick} onDrop={this.handleUpload}>
        {this.props.text}
      </div>
      <input
        style={{ display: 'none' }}
        type='file'
        ref={this.input}
        accept='image/*'
        onChange={this.handleUpload}
      />
    </React.Fragment>
  }
}

ImageUploader.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

class InputWithUnit extends React.Component {
  handleChange = (e) => {
    const { value } = e.target
    const { unit, onChange } = this.props
    // 把单位加上
    onChange(value + unit)
  }

  render () {
    const { unit, value, ...rest } = this.props
    const val = value.replace(unit, '')

    return <Fragment>
      <input {...rest} type='number' onChange={this.handleChange} value={val}/>
      {unit}
    </Fragment>
  }
}

InputWithUnit.propTypes = {
  unit: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

class ColumnWidth extends React.Component {
  handleChange = (widthWithUnit) => {
    const { style, onChange } = this.props
    const width = parseInt(widthWithUnit) > 0 ? widthWithUnit : 'auto'

    onChange({
      ...style,
      width
    })
  }

  render () {
    const { style: { width } } = this.props
    return <InputWithUnit
      unit='px' value={width || ''} onChange={this.handleChange}
      className='gm-printer-edit-input-custom'/>
  }
}

ColumnWidth.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

const Hr = () => <div style={{ backgroundColor: '#eee', height: '1px', margin: '5px 0', padding: '0' }}/>

const SubTitle = ({ text }) => (
  <div style={{ backgroundColor: '#eee', height: '1px', margin: '10px 0 13px 0', position: 'relative' }}>
    <span style={{
      position: 'absolute',
      top: '-8px',
      left: '20px',
      padding: '0 5px',
      backgroundColor: '#fff',
      color: '#848586'
    }}>{text}</span>
  </div>
)

const Title = ({ title, text }) => <Flex alignCenter className='gm-font-16'>
  <SvgBill style={{ color: 'rgb(253, 82, 113)' }}/>
  <span>{title}</span>
  <span className='gm-font-12'>{text}</span>
</Flex>

const Gap = ({ width = '100%', height = '3px' }) => <div style={{ width, height }}/>

const FieldBtn = ({ name, onClick }) => (
  <Flex alignCenter style={{ width: '50%', margin: '3px 0' }}>
    <span className='gm-printer-edit-plus-btn' onClick={onClick}>
      +
    </span>
    <span className='gm-padding-left-5'>{name}</span>
  </Flex>
)

const TipInfo = ({ text }) => <Flex alignCenter className='gm-padding-top-5 gm-text-red'>{text}</Flex>

export {
  Text,
  Textarea,
  TextPX,
  TextAlign,
  Separator,
  Fonter,
  Position,
  Line,
  Size,
  ImageUploader,
  InputWithUnit,
  ColumnWidth,
  Hr,
  SubTitle,
  Title,
  Gap,
  FieldBtn,
  TipInfo
}
