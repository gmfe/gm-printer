import React from 'react'
import _ from 'lodash'
import { getDataKey, isMultiTable } from '../util'
import Big from 'big.js'
import { observer } from 'mobx-react'
import { get } from 'mobx'
import i18next from '../../locales'

/**
 * 每列统计
 * @param colText 例子： {{列.出库金额}} {{列.称重数_销售单位}}{{列.销售单位}}
 * @param dataList
 * @returns {*|string}
 */
const sumCol = (colText, dataList) => {
  // const key = colText.split('.')[1].replace('}}', '')
  const match = /(?<=\.).+?(?=}})/.exec(colText)
  if (!match) return ''
  const key = match[0]

  let result
  try {
    result = dataList
      .reduce((acc, item) => {
        acc = acc.plus(item[key] || 0)
        return acc
      }, Big(0))
      .toFixed(2)
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

    return (
      <tr>
        {_.map(columns, (col, index) => {
          let html
          // 第一列
          if (index === 0) {
            html = i18next.t('合计')
          } else {
            html = summaryConfig.summaryColumns.includes(col.text)
              ? sumCol(col.text, currentPageTableData)
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
