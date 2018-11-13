import React from 'react'
import ReactDOM from 'react-dom'
import config from '../demo/config.json'
import { Editor } from '../src'
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
          onSave={this.handleSave}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, window.document.getElementById('appContainer'))
