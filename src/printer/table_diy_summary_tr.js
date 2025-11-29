import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { coverDigit2Uppercase, getDataKey, isMultiTable } from '../util'
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

  // 计算合计
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
  const numericValue = sumData(leftField.valueField)
  const upperCaseValue = needUpperCase ? coverDigit2Uppercase(numericValue) : ''

  const leftText = () => {
    if (isUpperLowerCaseSeparate) {
      // 大写金额在前
      if (isUpperCaseBefore) {
        return upperCaseValue
      }
      // 小写金额在前
      return numericValue
    }

    // 大写金额在前且需要大写金额
    if (isUpperCaseBefore) {
      return `${upperCaseValue} ${numericValue}`
    }

    if (needUpperCase) {
      return `${numericValue} ${upperCaseValue}`
    }

    return numericValue
  }

  const rightText = () => {
    if (isUpperLowerCaseSeparate) {
      if (isUpperCaseBefore) {
        return `${rightName} ${numericValue}`
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
