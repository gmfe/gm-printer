import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  coverDigit2Uppercase,
  getDataKey,
  isMultiTable,
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

  // 计算合计（逐行取原始列值，内置函数只作用在最终合计结果上）
  const sumData = field => {
    if (isMulti) {
      return _.reduce(
        tableData,
        (a, b, i) => {
          let result = a
          // 先通过 templateTable 获取原始字段的值
          const bRes = getRes(field, i)
          result = a.plus(+bRes || 0)

          // 双栏
          const multiField = buildTemplateField(field, MULTI_SUFFIX)
          result = result.plus(+getRes(multiField, i) || 0)

          // 三栏
          const multiField3 = buildTemplateField(field, MULTI_SUFFIX3)
          result = result.plus(+getRes(multiField3, i) || 0)

          return result
        },
        Big(0)
      ).toFixed(2)
    }

    return _.reduce(
      tableData,
      (a, b, i) => {
        let result = a
        const bRes = getRes(field, i)
        result = a.plus(+bRes || 0)
        return result
      },
      Big(0)
    ).toFixed(2)

    function getRes(field, i) {
      return printerStore
        .templateTable(field, dataKey, range ? range.begin + i : i, pageIndex)
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
  const fieldKey = extractSumField(leftField.valueField)
  // 求和用去掉内置函数后的列模板，多栏逻辑保持不变
  const numericValue = sumData(toSumColTemplate(leftField.valueField))
  // 仅对合计结果做模板/内置函数渲染
  const displayValue = templateSumResult(
    leftField.valueField,
    numericValue,
    fieldKey
  )
  const upperCaseValue = needUpperCase
    ? coverDigit2Uppercase(displayValue)
    : ''

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
