import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import ReactDOM from 'react-dom'
import { getHeight } from './util'

@observer
class Page extends React.Component {
  componentDidMount () {
    const $dom = ReactDOM.findDOMNode(this)

    this.props.store.setHeight({
      page: getHeight($dom)
    })
  }

  render () {
    const {children, store} = this.props
    const {paddingTop, paddingRight, paddingBottom, paddingLeft} = store.gap

    // -3px 是避免运算误差而溢出

    return (
      <div className='gm-printer-page' style={{
        width: `calc(${store.size.width} - ${paddingLeft} - ${paddingRight})`,
        height: `calc(${store.size.height} - ${paddingTop} - ${paddingBottom} - 3px)`,
        padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
      }}>
        <div className='gm-printer-page-inner' style={{
          width: `calc(${store.size.width} - ${paddingLeft} - ${paddingRight})`,
          height: `calc(${store.size.height} - ${paddingTop} - ${paddingBottom} - 3px)`
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
