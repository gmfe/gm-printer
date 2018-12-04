import React from 'react'
import { inject, observer } from 'mobx-react/index'

@inject('printerStore')
@observer
class Counter extends React.Component {
  render () {
    const { printerStore, name } = this.props
    const { _counter = [] } = printerStore.data

    return (
      <div className='gm-printer-counter' data-name={name}>
        {
          _counter.map(item => (
            <div key={item.text} className='gm-printer-counter-item'>
              <div className='gm-printer-counter-item-1'>{item.text}</div>
              <div>{item.len}</div>
            </div>
          ))
        }
      </div>
    )
  }
}

export default Counter
