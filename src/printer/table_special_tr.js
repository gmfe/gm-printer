import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { has, get } from 'mobx'

/**
 * 分类小计组件
 * @param data
 * @param config
 * @returns {*}
 */
const SpecialTr = ({ data, config }) => {
  const specialConfig =
    has(config, 'specialConfig') && get(config, 'specialConfig')
  const { style, template_text, separator, needUpperCase } = specialConfig
  const { list, type, fixedSize } = data

  let compiled
  try {
    compiled = _.template(template_text, { interpolate: /{{([\s\S]+?)}}/g })
  } catch (e) {
    compiled = () => template_text
  }

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

      return (
        <tr>
          <td
            colSpan={99}
            style={Object.assign({ fontWeight: 'bold' }, style)}
            dangerouslySetInnerHTML={{
              __html:
                needUpperCase && data.upperCaseText
                  ? data.upperCaseText
                  : data.text
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
