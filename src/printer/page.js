import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import printerStore from './store'
import ReactDOM from 'react-dom'
import { getHeight } from '../util'

@observer
class Page extends React.Component {
  componentDidMount () {
    const $dom = ReactDOM.findDOMNode(this)

    printerStore.setPageHeight(getHeight($dom))
  }

  render () {
    const { children } = this.props
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = printerStore.config.page.gap

    // -3px 是避免运算误差而溢出

    const { width, height } = printerStore.config.page.size

    return (
      <div className='gm-printer-page' style={{
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
