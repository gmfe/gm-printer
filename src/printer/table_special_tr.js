import React from 'react'
import _ from 'lodash'
import { observer } from 'mobx-react'

const SpecialTr = ({ data, specialConfig }) => {
  const { style, template_text, separator } = specialConfig
  const { list, type, fixedSize } = data

  let compiled
  try {
    compiled = _.template(template_text, { interpolate: /{{([\s\S]+?)}}/g })
  } catch (e) {
    compiled = () => template_text
  }

  switch (type) {
    case 'flex':
      const row = list.map((d, i) => {
        let text = ''
        try {
          text = compiled(d)
        } catch (e) {
          text = template_text
        }
        return <div key={i} className='gm-printer-special-container-box'>{text}</div>
      })

      // 固定每行div数量,如果不足数量就补足
      if (fixedSize) {
        while (row.length < fixedSize) {
          row[row.length] = <div className='gm-printer-special-container-box' key={row.length}/>
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
            {list.map(d => {
              let text = ''
              try {
                text = compiled(d)
              } catch (e) {
                text = template_text
              }
              return text
            }).join(separator)}
          </td>
        </tr>
      )

    default:
      return (
        <tr>
          <td colSpan={99} style={Object.assign({ fontWeight: 'bold' }, style)}>{data.text}</td>
        </tr>
      )
  }
}

export default observer(SpecialTr)
