import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { has, get } from 'mobx'
import { Flex } from '../components'

/**
 * 分类小计组件
 * @param data
 * @param config
 * @returns {*}
 */
const SpecialTr = ({ data, config }) => {
  const specialConfig =
    has(config, 'specialConfig') && get(config, 'specialConfig')
  const {
    style,
    template_text,
    separator,
    needUpperCase,
    isUpperCaseBefore,
    isUpperLowerCaseSeparate,
    fields
  } = specialConfig
  const { list, type, fixedSize } = data

  // 「显示分类名称/小计文案修改」实时生效：数据行带 _prefix 原料时，按当前 specialConfig 重拼前缀
  // 打印时配置与数据层拼前缀所用配置一致，重拼结果不变；编辑器预览改配置时实时刷新；导出（paint.js）不走本组件不受影响
  const applySubtotalText = html => {
    if (typeof html !== 'string' || data._prefix === undefined) {
      return html
    }
    const showCategoryName = specialConfig?.showCategoryName ?? true
    const subtotalText = specialConfig?.subtotalText ?? '小计'
    const newPrefix = showCategoryName
      ? `${data._categoryName ?? ''}${subtotalText}：`
      : `${subtotalText}：`
    // 前缀位于字符串头部，首次命中即替换；用函数替换避免 newPrefix 含 $ 序列时被特俗解释
    return html.replace(data._prefix, () => newPrefix)
  }

  let compiled
  try {
    compiled = _.template(template_text, { interpolate: /{{([\s\S]+?)}}/g })
  } catch (e) {
    compiled = () => template_text
  }

  const defaultFields = [
    {
      valueField: '出库金额'
    }
  ]
  const newFields = fields || defaultFields

  switch (type) {
    case 'flex':
      // eslint-disable-next-line no-case-declarations
      const row = list.map((d, i) => {
        let text = ''
        try {
          text = compiled(d)
        } catch (e) {
          text = template_text
        }
        return (
          <div key={i} className='gm-printer-special-container-box'>
            {text}
          </div>
        )
      })

      // 固定每行div数量,如果不足数量就补足
      if (fixedSize) {
        while (row.length < fixedSize) {
          row[row.length] = (
            <div
              className='gm-printer-special-container-box'
              key={row.length}
            />
          )
        }
      }

      return (
        <tr>
          <td colSpan={99} style={{ padding: 0 }}>
            <div className='gm-printer-special-container' style={style}>
              {row}
            </div>
          </td>
        </tr>
      )

    case 'separator':
      return (
        <tr>
          <td colSpan={99} style={{ padding: 0, ...style }}>
            {list
              .map(d => {
                let text = ''
                try {
                  text = compiled(d)
                } catch (e) {
                  text = template_text
                }
                return text
              })
              .join(separator)}
          </td>
        </tr>
      )

    default:
      if (!data.text)
        throw Error('_special缺少text,请检查data_to_key处理table数据代码!')

      if (isUpperLowerCaseSeparate) {
        const UpperCaseBefore =
          data[newFields[0].valueField]
            ?.upperLowerCaseSeparateAndUpperCaseBefore

        const htmlStr = isUpperCaseBefore
          ? UpperCaseBefore
          : data[newFields[0].valueField]?.upperLowerCaseSeparate
        return (
          <tr>
            <td
              colSpan={99}
              style={Object.assign({ fontWeight: 'bold' }, style)}
            >
              <Flex
                className='gm-flex-page gm-flex-justify-between-page'
                style={{ 'justify-content': 'space-between' }}
                dangerouslySetInnerHTML={{
                  __html: applySubtotalText(htmlStr || data.text)
                }}
              />
            </td>
          </tr>
        )
      }

      // eslint-disable-next-line no-case-declarations
      const getHtml = () => {
        if (isUpperCaseBefore) {
          return data[newFields[0].valueField]?.upperCaseBefore
        }
        if (needUpperCase) {
          return (
            data[newFields[0].valueField]?.upperCaseText || data?.upperCaseText
          )
        }
        return data[newFields[0]?.valueField]?.text || data.text
      }
      return (
        <tr>
          <td
            colSpan={99}
            style={Object.assign({ fontWeight: 'bold' }, style)}
            dangerouslySetInnerHTML={{
              __html: applySubtotalText(getHtml() || data.text)
            }}
          />
        </tr>
      )
  }
}

SpecialTr.propTypes = {
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}

export default observer(SpecialTr)
