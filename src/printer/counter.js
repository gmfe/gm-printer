import React from 'react'
import { inject, observer } from 'mobx-react/index'
import { getHeight } from '../util'
import ReactDOM from 'react-dom'

@inject('printerStore')
@observer
class Counter extends React.Component {
  componentDidMount () {
    const { printerStore, config: { show } } = this.props

    if (!printerStore.ready) {
      const $dom = ReactDOM.findDOMNode(this)
      if (show === true) {
        printerStore.setHeight('counter', getHeight($dom))
      } else {
        printerStore.setHeight('counter', 0)
      }
    }
  }

  render () {
    const { printerStore, config: { show } } = this.props
    const { categoryCount = [] } = printerStore.data

    if (show === false) return null

    return (
      <div className='gm-printer-count'>
        {
          categoryCount.map(item => (
            <div key={item.text} className='gm-printer-count-item'>
              <div className='gm-printer-count-item-1'>{item.text}</div>
              <div>{item.len}</div>
            </div>
          ))
        }
      </div>
    )
  }
}

export default Counter
