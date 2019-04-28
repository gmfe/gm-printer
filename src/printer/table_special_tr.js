import React from 'react'
import _ from 'lodash'

const SpecialTr = ({ data, specialConfig }) => {
  const { style, template_text, separator } = specialConfig
  const { list, type } = data

  const compiled = _.template(template_text, { interpolate: /{{([\s\S]+?)}}/g })
  console.log(type)
  switch (type) {
    case 'flex':
      return (
        <tr>
          <td colSpan={99} style={{ padding: 0 }}>
            <div className='gm-printer-special-container'>
              {list.map((d, i) => {
                let text = ''
                try {
                  text = compiled(d)
                } catch (e) {
                  text = template_text
                }
                return <div key={i} className='gm-printer-special-container-box'>
                  {text}
                </div>
              })}
            </div>
          </td>
        </tr>
      )

    case 'separator':
      return (
        <tr>
          <td colSpan={99} style={{ padding: 0 }}>
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

export default SpecialTr
