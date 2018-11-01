import React from 'react'
import PropTypes from 'prop-types'
import { toKey } from '../printer/key'
import _ from 'lodash'
import { Copy } from './component'

class Help extends React.Component {
  render () {
    const { data } = this.props

    const newData = toKey(data)
    console.log(newData)
    return (
      <div className='gm-printer-edit-help' style={{ padding: '10px', fontSize: '12px' }}>
        使用举例：
        <br/>
        "订单号：{'{{订单号}}'}" 生成 "订单号：{data.id}"
        <div style={{ padding: '10px' }}/>
        订单字段：
        <br/>
        <div>
          {_.map(newData, (v, k) => {
            if (k !== '_origin' && k !== '_table') {
              return (
                <Copy key={k} text={`{{${k}}}`}>
                  <div>
                    <span style={{ padding: '0 10px' }}>
                      {'{{'}{k}{'}}'}
                      &nbsp;=>&nbsp;
                      {_.template(`{{${k}}}`, {
                        interpolate: /{{([\s\S]+?)}}/g
                      })({ ...newData })}
                    </span>
                    <button>复制</button>
                  </div>
                </Copy>
              )
            }
          })}
        </div>
        表格字段：
        <br/>
        <div>
          {_.map(newData._table.orders[0], (v, k) => {
            if (k !== '_origin') {
              return (
                <Copy key={k} text={`{{列.${k}}}`}>
                  <div style={{ margin: '5px' }}>
                    <span style={{ padding: '0 10px', display: 'inline-block' }}>
                      {'{{'}列.{k}{'}}'}
                      &nbsp;=>&nbsp;
                      {_.template(`{{${k}}}`, {
                        interpolate: /{{([\s\S]+?)}}/g
                      })({ ...newData._table.orders[0] })}
                    </span>
                    <button>复制</button>
                  </div>
                </Copy>
              )
            }
          })}
        </div>
        异常表格字段：
        <br/>
        <div>
          {_.map(newData._table.abnormal[0], (v, k) => {
            if (k !== '_origin') {
              return (
                <Copy key={k} text={`{{列.${k}}}`}>
                  <div style={{ margin: '5px' }}>
                    <span style={{ padding: '0 10px', display: 'inline-block' }}>
                      {'{{'}列.{k}{'}}'}
                      &nbsp;=>&nbsp;
                      {_.template(`{{${k}}}`, {
                        interpolate: /{{([\s\S]+?)}}/g
                      })({ ...newData._table.abnormal[0] })}
                    </span>
                    <button>复制</button>
                  </div>
                </Copy>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

Help.propTypes = {
  data: PropTypes.object
}

export default Help
