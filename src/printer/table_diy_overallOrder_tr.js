import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  coverDigit2Uppercase,
  getDataKey,
  formatSumWithPrecision,
  toSumColTemplate,
  templateSumResult,
  extractSumField
} from '../util'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import Big from 'big.js'

const DiyOverallOrder = props => {
  const {
    config: { diyOverallOrder, dataKey },
    printerStore,
    pageIndex
  } = props
  const tableData = printerStore.data._table[getDataKey(dataKey)] || []

  const formatter = printerStore.config?.payAmountFormatter
  const highPrecisionMapping = printerStore.config?.highPrecisionFieldMapping

  // 计算合计（逐行取原始列值，内置函数只作用在最终合计结果上）
  const sumData = field => {
    // 查找高精度字段，有则直接从原始数据取值，避免 templateTable 的精度损失
    // 兼容映射 key 为模板串或字段名两种写法
    const fieldKey = extractSumField(field)
    const hpField =
      highPrecisionMapping?.[field] || highPrecisionMapping?.[fieldKey]
    const sum = _.reduce(
      tableData,
      (a, b, i) => {
        let result = a
        if (hpField) {
          result = a.plus(b._origin?.[hpField] ?? b[hpField] ?? 0)
        } else {
          const bRes = printerStore
            .templateTable(field, dataKey, i, pageIndex)
            .replace(/\(\)/g, '')
          result = a.plus(+bRes || 0)
        }
        return result
      },
      Big(0)
    )
    return formatSumWithPrecision(sum, formatter)
  }

  if (!diyOverallOrder?.show || !printerStore?.ready) {
    return null
  }

  const leftField = diyOverallOrder.fields?.[0]
  if (!leftField) return null
  const rightName = leftField.rightName || ''

  // 左右显示分离
  const isUpperLowerCaseSeparate = diyOverallOrder?.isUpperLowerCaseSeparate
  // 大写金额在前
  const isUpperCaseBefore = diyOverallOrder?.isUpperCaseBefore
  // 大写金额
  const needUpperCase = diyOverallOrder?.needUpperCase
  const fieldKey = extractSumField(leftField.valueField)
  // 求和用去掉内置函数后的列模板
  const numericValue = sumData(toSumColTemplate(leftField.valueField))
  // 仅对合计结果做模板/内置函数渲染
  const displayValue = templateSumResult(
    leftField.valueField,
    numericValue,
    fieldKey
  )
  // 大写金额
  const upperCaseValue = needUpperCase ? coverDigit2Uppercase(displayValue) : ''

  const leftText = () => {
    if (isUpperLowerCaseSeparate) {
      // 大写金额在前
      if (isUpperCaseBefore) {
        return upperCaseValue
      }
      // 小写金额在前
      return displayValue
    }

    // 大写金额在前且需要大写金额
    if (isUpperCaseBefore) {
      return `${upperCaseValue} ${displayValue}`
    }

    if (needUpperCase) {
      return `${displayValue} ${upperCaseValue}`
    }

    return displayValue
  }

  const rightText = () => {
    if (isUpperLowerCaseSeparate) {
      if (isUpperCaseBefore) {
        return `${rightName} ${displayValue}`
      }
      return `${rightName} ${upperCaseValue}`
    }

    return ''
  }
  return (
    <tr>
      <td colSpan={99}>
        <div style={{ ...leftField.style }} className='gm-flex-page'>
          {leftField.name}
          <div
            className={classNames('gm-flex-page', {
              'gm-flex-justify-between-page': isUpperLowerCaseSeparate,
              'gm-flex-grow-page': isUpperLowerCaseSeparate
            })}
          >
            {/* 左侧金额 */}
            <span>{leftText()}</span>

            <span>{rightText()}</span>
          </div>
        </div>
      </td>
    </tr>
  )
}
DiyOverallOrder.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object.isRequired,
  printerStore: PropTypes.object,
  pageIndex: PropTypes.number
}

export default observer(DiyOverallOrder)
