import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { getHeight } from '../util'

@inject('printerStore')
@observer
class Page extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  componentDidMount() {
    const $dom = this.ref.current

    this.props.printerStore.setPageHeight(getHeight($dom))
  }

  render() {
    const { children, printerStore } = this.props
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    } = printerStore.config.page.gap

    const {
      size: { width, height },
      pageStyle
    } = printerStore.config.page

    // 统一减2毫米,防止计算误差溢出
    const x = '- 2mm'
    return (
      <div
        ref={this.ref}
        className='gm-printer-page'
        style={{
          ...pageStyle,
          boxSizing: 'content-box',
          width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
          height: `calc(${height} - ${paddingTop} - ${paddingBottom} ${x})`,
          padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
        }}
      >
        <div
          className='gm-printer-page-inner'
          style={{
            width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
            height: `calc(${height} - ${paddingTop} - ${paddingBottom} ${x})`
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  printerStore: PropTypes.number
}

export default Page
