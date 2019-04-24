import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '../src'
// 模板配置
import config from '../src/template_config/default_config'
// 模拟数据
import mockData from '../src/mock_data/default_data'

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
        <Editor
          config={this.state.config}
          mockData={mockData}
          onSave={this.handleSave}
          showEditor
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
