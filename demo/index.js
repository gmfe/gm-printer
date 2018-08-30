import React from 'react'
import ReactDOM from 'react-dom'
import config from '../demo/config.json'
import data from '../demo/data'
import moment from 'moment'
import 'normalize.css/normalize.css'
import { PrinterEdit } from '../src'

const nData = {
  ...data,

  receive_begin_time_t1: moment(data.receive_begin_time).format('MM-DD HH:mm'),
  receive_end_time_t1: moment(data.receive_end_time).format('MM-DD HH:mm')
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      config
    }
  }

  handleSave = (config) => {
    console.log(JSON.stringify(config))

    this.setState({
      config
    })
  }

  render () {
    return (
      <div>
        <PrinterEdit
          data={nData}
          config={this.state.config}
          onSave={this.handleSave}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
