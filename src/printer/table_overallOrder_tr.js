import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import Big from 'big.js'
import {
  calculateDiySummary,
  coverDigit2Uppercase,
  extractSumField,
  getDataKey,
  hasDiySummaryExpression
} from '../util'
import { observer } from 'mobx-react'
import classNames from 'classnames'

const OverallOrder = props => {
  const {
    config: { overallOrder, dataKey, arrange },
    printerStore,
    printerStore: {
      data: { common }
    }
  } = props
  const tableDataKey = getDataKey(dataKey, arrange)
  const tableData = printerStore.data._table[tableDataKey] || []
  const formatter = printerStore.config?.payAmountFormatter
  const highPrecisionMapping = printerStore.config?.highPrecisionFieldMapping
  const isRoundFirst =
    printerStore.data._origin?.precision_control?.is_round_first === true

  // 普通字段沿用服务端整单值，表达式使用统一明细计算器
  const getOverallValue = valueField => {
    const fieldKey = extractSumField(valueField)
    if (!hasDiySummaryExpression(valueField)) {
      return common?.[fieldKey] ?? ''
    }
    return calculateDiySummary({
      tableData,
      valueField,
      formatter,
      highPrecisionMapping,
      isRoundFirst,
      renderTemplate: (template, index, options) =>
        printerStore
          .templateTable(template, tableDataKey, index, undefined, options)
          .replace(/\(\)/g, '')
    })
  }

  return (
    overallOrder?.show &&
    printerStore?.ready && (
      <tr>
        {_.map(overallOrder.fields, (item, index) => {
          const displayValue = getOverallValue(item.valueField)
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
                    {displayValue}
                  </span>
                  {overallOrder?.needUpperCase && (
                    <span>
                      {displayValue ? coverDigit2Uppercase(displayValue) : ''}
                    </span>
                  )}
                </div>
              </div>
            </td>
          )
        })}
      </tr>
    )
  )
}
OverallOrder.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object.isRequired,
  printerStore: PropTypes.object
}

export default observer(OverallOrder)
