import React from 'react'
import ReactDOM from 'react-dom'
import delivery from '../demo/delivery.json'
import invoice from './invoice.json'
import data from '../demo/data'
import moment from 'moment'
import { LayoutRoot, Select, Option } from 'react-gm'
import '../node_modules/react-gm/src/index.less'
import 'normalize.css/normalize.css'
import { SimpleConfig } from '../src'
import 'gm-xfont/iconfont.css'
import _ from 'lodash'

const config = {
  delivery,
  invoice
}

const details = _.map(_.range(50), (val, i) => {
  return {
    'spu_name': '宽叶菠',
    'pinlei_title': '菠菜' + i,
    'No': i
  }
})
data.details = details
const nData = {
  ...data,

  receive_begin_time_t1: moment(data.receive_begin_time).format('MM-DD HH:mm'),
  receive_end_time_t1: moment(data.receive_end_time).format('MM-DD HH:mm')
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      config: 'invoice'
    }
  }

  handleChangeTable = (config) => {
    this.setState({config})
  }

  render () {
    const configSelect = <Select value={this.state.config} onChange={this.handleChangeTable}>
      <Option value='invoice'>invoice</Option>
      <Option value='delivery'>delivery</Option>
    </Select>
    return (
      <div style={{height: '100vh'}}>
        <SimpleConfig
          key={this.state.config}
          data={nData}
          config={config[this.state.config]}
          tableData={nData.details}
          configSelect={configSelect}
        />
        <LayoutRoot/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
