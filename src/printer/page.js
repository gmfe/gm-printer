import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { getHeight } from '../util'

@inject('printerStore')
@observer
class Page extends React.Component {
  constructor () {
    super()
    this.ref = React.createRef()
  }

  componentDidMount () {
    const $dom = this.ref.current

    this.props.printerStore.setPageHeight(getHeight($dom))
  }

  render () {
    const { children, printerStore } = this.props
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = printerStore.config.page.gap

    const { width, height } = printerStore.config.page.size

    // -3px 是避免运算误差而溢出
    return (
      <div ref={this.ref} className='gm-printer-page' style={{
        boxSizing: 'content-box',
        width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
        height: `calc(${height} - ${paddingTop} - ${paddingBottom} - 3px)`,
        padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
      }}>
        <div className='gm-printer-page-inner' style={{
          width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
          height: `calc(${height} - ${paddingTop} - ${paddingBottom} - 3px)`
        }}>
          {children}
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  pageIndex: PropTypes.number
}

Page.defaultProps = {}

export default Page
