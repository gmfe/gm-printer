import React from 'react'
import ReactDOM from 'react-dom'
import delivery from '../demo/delivery.json'
import invoice from './invoice.json'
import data from '../demo/data'
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

const detail = _.map(_.range(40), (val, i) => {
  return {
    'spu_name': '宽叶菠',
    'pinlei_title': '菠菜' + i,
    'No': i
  }
})

const detail2 =  _.map(_.range(3), (val, i) => {
  return {
    'spu_name': '宽叶菠',
    'pinlei_title': '菠菜' + i,
    'No': i
  }
})

const tables = [detail, detail2]

const dataList = _.map(_.range(2), (val, i) => {
  return {...data, id: i}
})

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
          config={config[this.state.config]}
          data={dataList}
          tableData={tables}
          configSelect={configSelect}
          isBatch
        />
        <LayoutRoot/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
