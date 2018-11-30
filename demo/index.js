import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '../src'
import config from '../src/template_config/driver_sku_config'
import mockData from '../src/mock_data/driver_sku_data'

import 'gm-xfont/iconfont.css'
import '../node_modules/react-gm/src/index.less'

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
