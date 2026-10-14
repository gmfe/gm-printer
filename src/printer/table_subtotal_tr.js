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
            valueField: '出库金额'
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

  // 计算合计
  const sumData2 = (list, field) => {
    // 兼容之前
    if (field === 'total_item_price') field = '下单金额'
    if (field === 'real_item_price') field = '出库金额'
    if (field === 'settle_money2') field = '结算金额'
    if (field === 'total_money2') field = '金额'
    return _.reduce(
      list,
      (a, b) => {
        let result = a
        result = a.plus(b[field] || 0)
        if (b?.[field + MULTI_SUFFIX]) {
          result = result.plus(b?.[field + MULTI_SUFFIX])
        }
        if (b?.[field + MULTI_SUFFIX3]) {
          result = result.plus(b?.[field + MULTI_SUFFIX3])
        }
        return result
      },
      Big(0)
    ).toFixed(2)
  }

  const getData = field => {
    const data = printerStore.data.common
    return data?.[field] ?? ''
  }
  // 每页小计
  // show 是否展示小计，fields<Array> 合计的字段和展现的name，displayName 是否显示名字
  if (show && printerStore.ready) {
    const list = tableData.slice(range.begin, range.end)

    // 针对结款单的
    if (isSomeSubtotalTr) {
      const sum = {}

      _.each(fields, v => {
        sum[v.name] = sumData2(list, v.valueField)
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
      // 单元格拆分展示：第一格（左侧文案+数值）拆分为两个单元格，对齐复用每页合计设置的 textAlign；
      // 与打印账户总计金额支持共存（2026-09 交互确认）：拆分只作用于第一格，其余格按原 colSpan 渲染（与导出侧 paintSubtotal 行为一致）
      if (get(subtotal, 'isSplitCells')) {
        const item = fields[0]
        // 第一格总 colSpan 拆一半给左侧文案，剩余给数值（colSpan 缺省 99 表示整行）；
        // 宽度分配沿用原有逻辑：各格按 store 侧 fields[n].colSpan 照画，渲染端不调宽度
        const totalColSpan = item.colSpan ?? 99
        const leftColSpan = Math.floor(totalColSpan / 2)
        const cellStyle = {
          fontWeight: 'bold',
          justifyContent: flexStyle[subtotal.style?.textAlign],
          ...subtotal.style
        }

        return (
          <tr>
            <td colSpan={leftColSpan}>
              <div style={cellStyle} className='gm-flex-page'>
                {item.name}
              </div>
            </td>
            <td colSpan={totalColSpan - leftColSpan}>
              <div style={cellStyle} className='gm-flex-page'>
                <div
                  className={classNames('gm-flex-page', {
                    'gm-flex-justify-between-page': isUpperLowerCaseSeparate,
                    'gm-flex-grow-page': isUpperLowerCaseSeparate
                  })}
                >
                  <span
                    className={
                      isUpperCaseBefore
                        ? 'gm-printer-subtotal-isUpperCaseBefore-inter'
                        : ''
                    }
                  >
                    {item.type === 'useSummarize'
                      ? getData(item.valueField)
                      : sumData2(list, item.valueField)}
                  </span>
                  {subtotal?.needUpperCase && (
                    <span>
                      {item.type === 'useSummarize'
                        ? '大写：' +
                          coverDigit2Uppercase(getData(item.valueField))
                        : '大写：' +
                          coverDigit2Uppercase(sumData2(list, item.valueField))}
                    </span>
                  )}
                </div>
              </div>
            </td>
            {/* 拆分只拆第一格；其余格（打印账户总计金额等）沿用普通多格渲染语义 */}
            {_.map(fields.slice(1), (extra, extraIndex) => (
              <td
                colSpan={extra.colSpan ?? 99}
                key={`split_extra_${extraIndex}`}
              >
                <div style={cellStyle} className='gm-flex-page'>
                  {extra.name}
                  <div
                    className={classNames('gm-flex-page', {
                      'gm-flex-justify-between-page': isUpperLowerCaseSeparate,
                      'gm-flex-grow-page': isUpperLowerCaseSeparate
                    })}
                  >
                    <span>
                      {/* 账户总计金额等固定取数字段走 useSummarize；拆分场景其余格不参与当页求和 */}
                      {extra.type === 'useSummarize'
                        ? getData(extra.valueField)
                        : ''}
                    </span>
                    {subtotal?.needUpperCase &&
                      extra.type === 'useSummarize' && (
                        <span>
                          {'大写：' +
                            coverDigit2Uppercase(getData(extra.valueField))}
                        </span>
                      )}
                  </div>
                </div>
              </td>
            ))}
          </tr>
        )
      }

      return (
        <tr>
          {_.map(fields, (item, index) => {
            return (
              <td colSpan={item.colSpan ?? 99} key={index}>
                <div
                  style={{
                    fontWeight: 'bold',
                    justifyContent: flexStyle[subtotal.style?.textAlign], // flex布局中textAlign不生效，改使用justify-content
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
                      {item.type === 'useSummarize'
                        ? getData(item.valueField)
                        : index === 0
                        ? sumData2(list, item.valueField)
                        : ''}
                      {/* {index === 0 ? sumData(list, item.valueField) : ''} */}
                    </span>
                    {subtotal?.needUpperCase && ( // 是否需要大写金额
                      <span>
                        {item.type === 'useSummarize'
                          ? '大写：' +
                            coverDigit2Uppercase(getData(item.valueField))
                          : index === 0
                          ? '大写：' +
                            coverDigit2Uppercase(
                              sumData2(list, item.valueField)
                            )
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
