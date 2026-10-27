import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { getHeight } from '../util'
import classNames from 'classnames'
import { LONG_PRINT } from '../config'

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
    const { children, printerStore, isFontFamily } = this.props
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    } = printerStore.config.page.gap

    const {
      size: { width, height },
      pageStyle,
      fontFamily,
      type
    } = printerStore.config.page
    // 统一减2毫米,防止计算误差溢出
    const x = '- 2mm'
    return (
      <div
        ref={this.ref}
        className={classNames('gm-printer-page', {
          'gm-printer-page-fontFamily': isFontFamily
        })}
        style={{
          ...pageStyle,
          // 模板级自定义字体（station 配送单模板 page.fontFamily）：整页生效，未配置时保持浏览器默认
          ...(fontFamily ? { fontFamily } : undefined),
          boxSizing: 'content-box',
          width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
          padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
          height:
            type === LONG_PRINT
              ? ``
              : `calc(${height} - ${paddingTop} - ${paddingBottom} ${x})`
        }}
      >
        <div
          className='gm-printer-page-inner'
          style={{
            width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
            height:
              type === LONG_PRINT
                ? ``
                : `calc(${height} - ${paddingTop} - ${paddingBottom} ${x})`
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  printerStore: PropTypes.number,
  isFontFamily: PropTypes.bool
}

export default Page
