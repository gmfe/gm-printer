import React from 'react'
import _ from 'lodash'
import {
  getDataKey,
  isMultiTable,
  formatSumWithPrecision,
  getHighPrecisionField
} from '../util'
import Big from 'big.js'
import { observer } from 'mobx-react'
import { get } from 'mobx'
import i18next from '../../locales'

const regExp = text => {
  const match = /{{([^{}]+)}}/.exec(text)
  const key = match ? match[1] : ''
  return key ? key.split('.')[1] : ''
}
/**
 * 每列统计
 * @param key
 * @param dataList
 * @param summaryFieldsResultToNumber 需要转换为数字的汇总字段
 * @param formatter 精度格式化函数，由 stationv2 传入 AmountPrecisionUtil(precision_control)
 * @param highPrecisionMapping 高精度字段映射，优先用高精度字段求和
 * @returns {*|string}
 */
const sumCol = (
  key,
  dataList,
  summaryFieldsResultToNumber = [],
  formatter,
  highPrecisionMapping
) => {
  let result
  try {
    // 优先使用高精度字段求和
    const sumKey = getHighPrecisionField(key, highPrecisionMapping)
    const sum = dataList.reduce((acc, item) => {
      const val = item[sumKey] ?? item._origin?.[sumKey] ?? 0
      acc = acc.plus(val)
      return acc
    }, Big(0))
    result = formatSumWithPrecision(sum, formatter)

    if (summaryFieldsResultToNumber.includes(key)) {
      result = Number(result)
    }
  } catch (e) {
    result = ''
  }
  return result
}

// 最新每页合计
const PageSummary = props => {
  const {
    config,
    config: { dataKey, arrange, columns },
    range,
    printerStore
  } = props

  const _dataKey = getDataKey(dataKey, arrange)

  const summaryConfig = get(config, 'summaryConfig')

  if (
    summaryConfig?.pageSummaryShow &&
    printerStore.ready &&
    !isMultiTable(_dataKey)
  ) {
    const tableData = printerStore.data._table[_dataKey] || []
    const currentPageTableData = tableData.slice(range.begin, range.end)

    // 需要转换为数字的汇总字段
    let summaryFieldsResultToNumber =
      printerStore.config?.summaryFieldsResultToNumber
    if (summaryFieldsResultToNumber) {
      summaryFieldsResultToNumber = summaryFieldsResultToNumber.map(item =>
        regExp(item)
      )
    }
    const formatter = printerStore.config?.payAmountFormatter
    const highPrecisionMapping = printerStore.config?.highPrecisionFieldMapping
    return (
      <tr>
        {_.map(columns, (col, index) => {
          let html
          // 第一列
          if (index === 0) {
            html = i18next.t('合计')
          } else {
            const key = regExp(col.text)
            html =
              summaryConfig.summaryColumns
                .map(text => regExp(text))
                .includes(key) && key
                ? sumCol(
                    key,
                    currentPageTableData,
                    summaryFieldsResultToNumber,
                    formatter,
                    highPrecisionMapping
                  )
                : ' '
          }

          return (
            <td
              style={summaryConfig.style}
              colSpan={1}
              key={index}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        })}
      </tr>
    )
  } else {
    return null
  }
}

export default observer(PageSummary)
