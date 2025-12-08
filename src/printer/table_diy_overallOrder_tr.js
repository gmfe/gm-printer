import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import Big from 'big.js'
import { coverDigit2Uppercase, getDataKey } from '../util'
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

  // 计算合计
  const sumData = field => {
    return _.reduce(
      tableData,
      (a, b, i) => {
        let result = a
        const bRes = printerStore
          .templateTable(field, dataKey, i, pageIndex)
          .replace(/\(\)/g, '')
        result = a.plus(+bRes || 0)
        return result
      },
      Big(0)
    ).toFixed(2)
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
  // 小写金额
  const numericValue = sumData(leftField.valueField)
  // 大写金额
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
  // return (
  //   diyOverallOrder?.show &&
  //   printerStore?.ready && (
  //     <tr>
  //       {_.map(diyOverallOrder.fields, (item, index) => {
  //         return (
  //           <td colSpan={item.colSpan ?? 99} key={index}>
  //             <div style={{ ...item.style }} className='gm-flex-page'>
  //               {item.name}
  //               <div
  //                 className={classNames('gm-flex-page', {
  //                   'gm-flex-justify-between-page':
  //                     diyOverallOrder?.isUpperLowerCaseSeparate,
  //                   'gm-flex-grow-page':
  //                     diyOverallOrder?.isUpperLowerCaseSeparate
  //                 })}
  //               >
  //                 <span
  //                   className={
  //                     diyOverallOrder?.isUpperCaseBefore
  //                       ? 'gm-printer-subtotal-isUpperCaseBefore-inter'
  //                       : ''
  //                   }
  //                 >
  //                   {sumData(item.valueField)}
  //                 </span>
  //                 {diyOverallOrder?.needUpperCase && (
  //                   <span>
  //                     {coverDigit2Uppercase(sumData(item.valueField))
  //                       ? coverDigit2Uppercase(sumData(item.valueField))
  //                       : ''}
  //                   </span>
  //                 )}
  //               </div>
  //             </div>
  //           </td>
  //         )
  //       })}
  //     </tr>
  //   )
  // )
}
DiyOverallOrder.propTypes = {
  config: PropTypes.object.isRequired,
  range: PropTypes.object.isRequired,
  printerStore: PropTypes.object,
  pageIndex: PropTypes.number
}

export default observer(DiyOverallOrder)
