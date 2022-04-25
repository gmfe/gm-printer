import React from 'react'
import i18next from '../../locales'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { MULTI_SUFFIX, MULTI_SUFFIX3 } from '../config'
import Big from 'big.js'
import { coverDigit2Uppercase, getDataKey } from '../util'
import { observer } from 'mobx-react'
import { get } from 'mobx'
import classNames from 'classnames'

/**
 * 每页合计组件,分页计算后,根据range来统计每页合计数据
 * @param props
 * @returns {*}
 */
const flexStyle = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}
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
            name: i18next.t('每页合计：'),
            valueField: 'real_item_price'
          }
        ],
        displayName = false // 是否展示字段名
      }
    },
    range,
    printerStore,
    isSomeSubtotalTr
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
        const _origin3 = b['_origin' + MULTI_SUFFIX3] || {}

        result = a.plus(_origin[field] || 0)
        if (_origin2[field]) {
          result = result.plus(_origin2[field])
        }
        if (_origin3[field]) {
          result = result.plus(_origin3[field])
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

    // 针对结款单的
    if (isSomeSubtotalTr) {
      const sum = {}

      _.each(fields, v => {
        sum[v.name] = sumData(list, v.valueField)
      })
      let subtotalStr = ''
      for (const name in sum) {
        const price = sum[name]
        const priceUpperCase = get(subtotal, 'needUpperCase') // needUpperCase在初始模板中undefined,所以必须用这个方法
          ? '大写：' + coverDigit2Uppercase(price)
          : ''
        if (displayName) {
          subtotalStr += `${name}&nbsp;${price}&nbsp;&nbsp;&nbsp;${priceUpperCase}&nbsp;&nbsp;&nbsp;&nbsp;`
        } else {
          subtotalStr += `${price}&nbsp;&nbsp;&nbsp;${priceUpperCase}&nbsp;&nbsp;&nbsp;&nbsp;`
        }
      }

      return (
        <tr>
          <td
            colSpan={99}
            style={{ fontWeight: 'bold', ...style }}
            dangerouslySetInnerHTML={{
              __html: `${i18next.t('每页合计')}：${subtotalStr}`
            }}
          />
        </tr>
      )
    } else {
      return (
        <tr>
          {_.map(fields, (item, index) => {
            return (
              <td colSpan={item.colSpan ?? 99} key={index}>
                <div
                  style={{
                    fontWeight: 'bold',
                    'justify-content': flexStyle[subtotal.style?.textAlign], // flex布局中textAlign不生效，改使用justify-content
                    ...subtotal.style
                  }}
                  className='gm-flex-page'
                >
                  {item.name}
                  <div
                    className={classNames('gm-flex-page', {
                      'gm-flex-justify-between-page': isUpperLowerCaseSeparate, // 决定大小写金额是否分开在两端
                      'gm-flex-grow-page': isUpperLowerCaseSeparate
                    })}
                  >
                    <span
                      className={
                        isUpperCaseBefore // 决定小写金额是否在前
                          ? 'gm-printer-subtotal-isUpperCaseBefore-inter'
                          : ''
                      }
                    >
                      {/* 这样写是为了支持自定义单元，index = 1时是自定义单元格 */}
                      {index === 0 ? sumData(list, item.valueField) : ''}
                    </span>
                    {subtotal?.needUpperCase && ( // 是否需要大写金额
                      <span>
                        {index === 0
                          ? '大写：' +
                            coverDigit2Uppercase(sumData(list, item.valueField))
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
