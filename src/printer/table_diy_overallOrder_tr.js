import React from 'react'
import PropTypes from 'prop-types'
import DiySummary from './table_diy_summary_tr'

// 自定义整单合计复用通用自定义合计组件
const DiyOverallOrder = props => {
  return <DiySummary {...props} configKey='diyOverallOrder' />
}

DiyOverallOrder.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object,
  printerStore: PropTypes.object,
  pageIndex: PropTypes.number
}

export default DiyOverallOrder
