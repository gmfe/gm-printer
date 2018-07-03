import React from 'react'
import ReactDOM from 'react-dom'
import config from '../demo/config.json'
import data from '../demo/data'
import moment from 'moment'
import {Storage, Tip, LayoutRoot} from 'react-gm'
import '../node_modules/react-gm/src/index.less'
import 'normalize.css/normalize.css'
import {PrinterConfig} from '../src'
import 'gm-xfont/iconfont.css'

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

    handleSave = (c) => {
      return new Promise(resolve => {
        Storage.set('gm-printer-config', c)
        setTimeout(() => {
          resolve()
          Tip.success('保存成功')
        }, 2000)
      })
    };

    render () {
      return (
        <div style={{height: '100vh'}}>
          <PrinterConfig
            data={nData}
            config={this.state.config}
            tableData={nData.details}
            onSave={this.handleSave}
          />
          <LayoutRoot/>
        </div>
      )
    }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
