import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  getPageBorderBackgroundStyle,
  mergePageStyleWithBorder
} from '../common/page_border'

@inject('printerStore')
@observer
class MergePage extends React.Component {
  render() {
    const { children, printerStore } = this.props
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    } = printerStore.config.page.gap

    const { width } = printerStore.config.page.size

    const borderStyle = getPageBorderBackgroundStyle({
      enablePageBorder: printerStore.enablePageBorder,
      borderId: printerStore.config.page.borderId,
      pageBorderTypes: printerStore.config.pageBorderTypes
    })
    const mergedPageStyle = mergePageStyleWithBorder(null, borderStyle)

    return (
      <div
        className='gm-printer-page'
        style={{
          ...mergedPageStyle,
          boxSizing: 'content-box',
          width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
          padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
          breakAfter: 'auto'
        }}
      >
        <div
          className='gm-printer-page-inner'
          style={{
            width: `calc(${width} - ${paddingLeft} - ${paddingRight})`,
            breakAfter: 'auto'
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

MergePage.propTypes = {
  printerStore: PropTypes.object
}

export default MergePage
