import React from 'react'
import { inject, observer } from 'mobx-react'
import i18next from '../../locales'
import PropTypes from 'prop-types'

const configs = [
  {
    id: 'len',
    name: (
      <div className='gm-printer-counter-item-1'>{i18next.t('商品数')}</div>
    ),
    value: item => <div className='gm-printer-counter-item-1'>{item.len}</div>
  },
  {
    id: 'subtotal',
    name: <div className='gm-printer-counter-item-1'>{i18next.t('小计')}</div>,
    value: item => (
      <div className='gm-printer-counter-item-1'>{item.subtotal}</div>
    )
  },
  {
    id: 'quantity',
    name: (
      <div className='gm-printer-counter-item-1'>{i18next.t('下单数')}</div>
    ),
    value: item => (
      <div className='gm-printer-counter-item-1'>{item.quantity}</div>
    )
  },
  {
    id: 'realWeight',
    name: (
      <div className='gm-printer-counter-item-1'>{i18next.t('出库数小计')}</div>
    ),
    value: item => (
      <div className='gm-printer-counter-item-1'>{item.realWeight}</div>
    )
  }
]

@inject('printerStore')
@observer
class Counter extends React.Component {
  render() {
    // value, _counter 需要 初始值，兼容之前版本
    const { printerStore, value = ['len'] } = this.props
    const { _counter = [] } = printerStore.data

    const rows = configs.filter(o => value.includes(o.id))

    return (
      <div className='gm-printer-counter'>
        <div className='gm-printer-counter-item'>
          <div>{i18next.t('类别')}</div>
          {rows.map((row, i) => (
            <span key={i}>{row.name}</span>
          ))}
        </div>
        {_counter.map(item => (
          <div key={item.text} className='gm-printer-counter-item'>
            <div>{item.text}</div>
            {rows.map((row, i) => (
              <span key={i}>{row.value(item)}</span>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

Counter.propTypes = {
  printerStore: PropTypes.object,
  value: PropTypes.array
}

export default Counter
