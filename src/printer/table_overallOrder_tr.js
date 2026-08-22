import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import Big from 'big.js'
import { coverDigit2Uppercase } from '../util'
import { observer } from 'mobx-react'
import classNames from 'classnames'

const OverallOrder = props => {
  const {
    config: { overallOrder },
    printerStore,
    printerStore: {
      data: { common }
    },
    isLastTablePage
  } = props

  // showEachPage 默认 true（老模板缺省视为每页展示）；false 时仅表格最后一页渲染
  const showEachPage = overallOrder?.showEachPage !== false
  const shouldShow =
    overallOrder?.show &&
    printerStore?.ready &&
    (showEachPage || isLastTablePage)

  if (!shouldShow) return null

  return (
    <tr>
      {_.map(overallOrder.fields, (item, index) => {
        return (
          <td colSpan={item.colSpan} key={index}>
            <div style={{ ...item.style }} className='gm-flex-page'>
              {item.name}
              <div
                className={classNames('gm-flex-page', {
                  'gm-flex-justify-between-page':
                    overallOrder?.isUpperLowerCaseSeparate,
                  'gm-flex-grow-page': overallOrder?.isUpperLowerCaseSeparate
                })}
              >
                <span
                  className={
                    overallOrder?.isUpperCaseBefore
                      ? 'gm-printer-subtotal-isUpperCaseBefore-inter'
                      : ''
                  }
                >
                  {common?.[item.valueField] ?? ''}
                </span>
                {overallOrder?.needUpperCase && (
                  <span>
                    {common?.[item.valueField]
                      ? coverDigit2Uppercase(common[item.valueField])
                      : ''}
                  </span>
                )}
              </div>
            </div>
          </td>
        )
      })}
    </tr>
  )
}
OverallOrder.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object.isRequired,
  printerStore: PropTypes.object,
  isLastTablePage: PropTypes.bool
}

OverallOrder.defaultProps = {
  isLastTablePage: true
}

export default observer(OverallOrder)
