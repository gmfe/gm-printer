import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  calculateDiySummary,
  coverDigit2Uppercase,
  getDataKey,
  isMultiTable,
  formatSumWithPrecision,
  toSumColTemplate,
  templateSumResult,
  extractSumField
} from '../util'
import { MULTI_SUFFIX, MULTI_SUFFIX3 } from '../config'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import Big from 'big.js'

function buildTemplateField(fieldStr, suffix) {
  // 如果 field 是 "{{列.下单数}}"，提取出 "下单数"
  const match = fieldStr.match(/\{\{列\.([^}]+)\}\}/)
  if (match) {
    // 构造新的模板字符串：{{列.下单数_MULTI_SUFFIX}}
    return `{{列.${match[1]}${suffix}}}`
  }
  // 如果 field 不是模板格式，直接返回（这种情况应该不会发生）
  return fieldStr + suffix
}

/**
 * 通用的自定义合计组件
 * @param {string} configKey - 配置键名
 * @param {Function} getTableData - 获取表格数据的函数，用于区分整单合计和每页合计
 */
const DiySummary = props => {
  const {
    configKey,
    config: { dataKey, arrange },
    printerStore,
    range,
    pageIndex,
    getTableData
  } = props

  const diyConfig = props.config[configKey]

  // 根据 configKey 决定如何获取数据
  const tableData = getTableData
    ? getTableData(printerStore, dataKey, arrange, range)
    : printerStore.data._table[getDataKey(dataKey, arrange)] || []

  // 判断是否是多栏表格
  const isMulti = isMultiTable(dataKey)

  const formatter = printerStore.config?.payAmountFormatter
  const highPrecisionMapping = printerStore.config?.highPrecisionFieldMapping
  const isRoundFirst =
    printerStore.data._origin?.precision_control?.is_round_first === true

  // 单栏使用统一计算器；多栏保留原有后缀字段累加逻辑
  const sumData = field => {
    if (!isMulti) {
      return calculateDiySummary({
        tableData,
        valueField: field,
        formatter,
        highPrecisionMapping,
        isRoundFirst,
        renderTemplate: (template, index, options) =>
          printerStore
            .templateTable(
              template,
              dataKey,
              range ? range.begin + index : index,
              pageIndex,
              options
            )
            .replace(/\(\)/g, '')
      })
    }

    const sum = _.reduce(
      tableData,
      (total, row, index) => {
        let result = total.plus(+getRes(field, index) || 0)
        const multiField = buildTemplateField(field, MULTI_SUFFIX)
        result = result.plus(+getRes(multiField, index) || 0)
        const multiField3 = buildTemplateField(field, MULTI_SUFFIX3)
        return result.plus(+getRes(multiField3, index) || 0)
      },
      Big(0)
    )
    return formatSumWithPrecision(sum, formatter)

    function getRes(template, index) {
      return printerStore
        .templateTable(
          template,
          dataKey,
          range ? range.begin + index : index,
          pageIndex
        )
        .replace(/\(\)/g, '')
    }
  }

  if (!diyConfig?.show || !printerStore?.ready) {
    return null
  }

  const leftField = diyConfig.fields?.[0]
  if (!leftField) {
    return null
  }

  const rightName = leftField.rightName || ''
  const isUpperLowerCaseSeparate = diyConfig?.isUpperLowerCaseSeparate
  const isUpperCaseBefore = diyConfig?.isUpperCaseBefore
  const needUpperCase = diyConfig?.needUpperCase
  // 单栏完整遵循统一舍入顺序；多栏保持原有求和后执行模板逻辑
  const displayValue = isMulti
    ? templateSumResult(
        leftField.valueField,
        sumData(toSumColTemplate(leftField.valueField)),
        extractSumField(leftField.valueField)
      )
    : sumData(leftField.valueField)
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

DiySummary.propTypes = {
  configKey: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  printerStore: PropTypes.object,
  range: PropTypes.object,
  pageIndex: PropTypes.number,
  getTableData: PropTypes.func
}

export default observer(DiySummary)
