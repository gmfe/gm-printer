import React from 'react'
import i18next from '../../locales'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { MULTI_SUFFIX } from '../config'
import Big from 'big.js'
import { coverDigit2Uppercase, getDataKey } from '../util'
import { observer } from 'mobx-react'
import { get } from 'mobx'
import { Flex } from '../components'

/**
 * 每页合计组件,分页计算后,根据range来统计每页合计数据
 * @param props
 * @returns {*}
 */
const SubtotalTr = props => {
  const {
    config: {
      dataKey,
      arrange,
      subtotal,
      subtotal: {
        show,
        isUpperCaseBefore, // 决定小写金额是否在前
        isUpperLowerCaseSeparate, // 决定大小写金额是否分开在两端
        style,
        fields = [
          {
            name: i18next.t('出库金额'),
            valueField: 'real_item_price'
          }
        ],
        displayName = false // 是否展示字段名
      }
    },
    range,
    printerStore
  } = props

  const tableData = printerStore.data._table[getDataKey(dataKey, arrange)] || []
  // 计算合计
  const sumData = (list, field) => {
    return _.reduce(
      list,
      (a, b) => {
        let result = a

        const _origin = b._origin || {}
        const _origin2 = b['_origin' + MULTI_SUFFIX] || {}

        result = a.plus(_origin[field] || 0)
        if (_origin2[field]) {
          result = result.plus(_origin2[field])
        }
        return result
      },
      Big(0)
    ).toFixed(2)
  }

  // 每页小计
  // show 是否展示小计，fields<Array> 合计的字段和展现的name，displayName 是否显示名字
  if (show && printerStore.ready) {
    const list = tableData.slice(range.begin, range.end)

    const sum = {}

    _.each(fields, v => {
      sum[v.name] = sumData(list, v.valueField)
    })

    // 定义每页小记的左右两侧内容
    let subtotalLeftContent
    let subtotalRightContent

    for (const name in sum) {
      const price = sum[name]
      const priceUpperCase = get(subtotal, 'needUpperCase') // needUpperCase在初始模板中undefined,所以必须用这个方法
        ? '大写：' + coverDigit2Uppercase(price)
        : ''
      if (displayName) {
        // 大写金额是否在前
        if (isUpperCaseBefore) {
          subtotalLeftContent = `${name}${priceUpperCase}`
          subtotalRightContent = `${price}`
        } else {
          subtotalLeftContent = `${price}`
          subtotalRightContent = `${name} ${priceUpperCase}`
        }
      } else {
        if (isUpperCaseBefore) {
          subtotalLeftContent = `${priceUpperCase}`
          subtotalRightContent = `${price}`
        } else {
          subtotalLeftContent = `${price}`
          subtotalRightContent = `${priceUpperCase}`
        }
      }
    }

    return (
      <tr>
        <td
          colSpan={99}
          style={{ fontWeight: 'bold', ...style }}
          // dangerouslySetInnerHTML={{
          //   __html: `${i18next.t('每页合计')}：${subtotalStr}`
          // }}flex-grow: 1
        >
          {/* 大写金额和小写金额分开在表格的两侧，通过控制类名实现，添加类名后，覆盖原来的居中、靠右靠左 */}
          <div
            className={
              isUpperLowerCaseSeparate
                ? 'gm-printer-subtotal-UpperLowerCaseSeparate-outer'
                : ''
            }
          >
            {i18next.t('每页合计')}：
            <span
              className={
                isUpperLowerCaseSeparate
                  ? 'gm-printer-subtotal-UpperLowerCaseSeparate-inter'
                  : ''
              }
            >
              <span>&nbsp;&nbsp;{subtotalLeftContent}&nbsp;&nbsp;</span>
              <span>&nbsp;&nbsp;{subtotalRightContent}&nbsp;&nbsp;</span>
            </span>
          </div>
        </td>
      </tr>
    )
  } else {
    return null
  }
}

SubtotalTr.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object.isRequired,
  printStore: PropTypes.object
}

export default observer(SubtotalTr)
