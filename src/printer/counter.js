import React from 'react'
import { inject, observer } from 'mobx-react/index'
import { getHeight } from '../util'

@inject('printerStore')
@observer
class Counter extends React.Component {
  constructor () {
    super()
    this.ref = React.createRef()
  }

  componentDidMount () {
    const { printerStore, config: { show } } = this.props

    if (!printerStore.ready) {
      const $dom = this.ref.current
      if (show === true) {
        printerStore.setHeight('counter', getHeight($dom))
      } else {
        printerStore.setHeight('counter', 0)
      }
    }
  }

  render () {
    const { printerStore, config: { show } } = this.props
    const { _counter = [] } = printerStore.data

    if (show === false) return null

    return (
      <div className='gm-printer-count' ref={this.ref}>
        {
          _counter.map(item => (
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
