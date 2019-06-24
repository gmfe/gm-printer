import React from 'react'
import ReactDOM from 'react-dom'
import DeliveryEditor from './delivery_bill'
import PurchaseEditor from './purchase'
import StockInEditor from './stock_in'
import SettleEditor from './settle'

import './style.less'

class App extends React.Component {
  state = {
    selected: null
  }

  handleSave = (config) => {
    console.log(JSON.stringify(config))
  }

  handleOnClick = (selected) => {
    this.setState({ selected })
  }

  render () {
    const { selected } = this.state

    return (
      <div>
        <div className='wrap' style={{ display: selected && 'none' }}>
          <div className='btn'>
            <button onClick={this.handleOnClick.bind(this, 'delivery')}>配送单</button>
            <button onClick={this.handleOnClick.bind(this, 'purchase')}>采购单</button>
            <button onClick={this.handleOnClick.bind(this, 'stock_in')}>入库单</button>
            <button onClick={this.handleOnClick.bind(this, 'settle')}>结款单</button>
          </div>
        </div>
        {selected === 'delivery' && <DeliveryEditor handleSave={this.handleSave}/>}
        {selected === 'purchase' && <PurchaseEditor handleSave={this.handleSave}/>}
        {selected === 'stock_in' && <StockInEditor handleSave={this.handleSave}/>}
        {selected === 'settle' && <SettleEditor handleSave={this.handleSave}/>}
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
