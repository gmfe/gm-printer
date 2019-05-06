import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './editor'
import { insertCSS } from '../util'
import { getCSS as getPrinterCSS } from '../printer'

// eslint-disable-next-line
import editorCSS from 'css-loader!postcss-loader!less-loader!./style.lesss'

function getEditorCSS () {
  return editorCSS.toString()
}

class EditorShadow extends React.Component {
  ref = React.createRef()

  componentDidMount () {
    const shadowRoot = this.ref.current.attachShadow({ mode: 'open' })
    // 在window下挂 shadow root
    window.shadowRoot = shadowRoot
    ReactDOM.render(<Editor {...this.props}/>, shadowRoot)
    insertCSS(getPrinterCSS() + getEditorCSS(), shadowRoot)
  }

  componentWillUnmount () {
    // 移除示例,不然很多意想不到的事情发生
    ReactDOM.unmountComponentAtNode(window.shadowRoot)
  }

  render () {
    return <div id='shadowroot' ref={this.ref}/>
  }
}

EditorShadow.propTypes = Editor.propTypes

export default EditorShadow
