import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '../src'
// 模板配置
import { defaultConfig } from './delivery_bill/template_config'
// 模拟数据
import mockData from './delivery_bill/mock_data/default_data'
// 添加的字段
import addFields from './delivery_bill/add_fields'
import toKey from './delivery_bill/data_to_key'

import './style.less'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      config: defaultConfig,
      selected: ''
    }
  }

  handleSave = (config) => {
    console.log(JSON.stringify(config))

    this.setState({
      config
    })
  }

  handleOnClick = (selected) => {
    this.setState({
      selected
    })
  }

  render () {
    const { selected } = this.state

    return (
      <div>
        <div className='btn'>
          <button onClick={this.handleOnClick.bind(this, 'delivery')}>配送单</button>
          <button onClick={this.handleOnClick.bind(this, 'purchase')}>采购单</button>
          <button onClick={this.handleOnClick.bind(this, 'storage')}>入库单</button>
        </div>
        {selected === 'delivery' && <Editor
          config={this.state.config}
          mockData={toKey(mockData)}
          onSave={this.handleSave}
          showEditor
          addFields={addFields}
        />}
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
