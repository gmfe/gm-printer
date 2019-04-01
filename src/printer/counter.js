import React from 'react'
import { inject, observer } from 'mobx-react'
import i18next from '../../locales'
import _ from 'lodash'

@inject('printerStore')
@observer
class Counter extends React.Component {
  render () {
    let { printerStore, value } = this.props
    const { _counter = [] } = printerStore.data

    // 兼容之前版本
    if (value === undefined) value = [ 'len' ]
    const showLen = _.includes(value, 'len')
    const showSubtotal = _.includes(value, 'subtotal')

    return (
      <div className='gm-printer-counter'>
        <div className='gm-printer-counter-item'>
          <div>{i18next.t('类别')}</div>
          {showLen && <div className='gm-printer-counter-item-1'>{i18next.t('商品数')}</div>}
          {showSubtotal && <div className='gm-printer-counter-item-1'>{i18next.t('小计')}</div>}
        </div>
        {
          _counter.map(item => (
            <div key={item.text} className='gm-printer-counter-item'>
              <div>{item.text}</div>
              {showLen && <div className='gm-printer-counter-item-1'>{item.len}</div>}
              {showSubtotal && <div className='gm-printer-counter-item-1'>{item.subtotal}</div>}
            </div>
          ))
        }
      </div>
    )
  }
}

export default Counter
