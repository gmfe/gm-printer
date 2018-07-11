import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Flex } from 'react-gm'
import './style.less'
import { printerJS } from './util'
import { doPrint, doPrintBatch } from './do_print'

class SimpleConfig extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      config: props.config
    }
  }

  componentDidMount () {
    const $iframe = ReactDOM.findDOMNode(this.refIframe)
    this.$iframe = $iframe

    const script = $iframe.contentWindow.document.createElement('script')
    script.src = printerJS
    $iframe.contentWindow.document.body.append(script)

    script.addEventListener('load', () => {
      this.doRender()
    })
  }

  doRender = () => {
    const {config} = this.state
    const {data, tableData, isBatch} = this.props
    if (isBatch) {
      this.$iframe.contentWindow.renderBatch({
        datas: data,
        tableDatas: tableData,
        config
      })
    } else {
      this.$iframe.contentWindow.render({
        data,
        tableData,
        config
      })
    }
  }

  handleTestPrint = () => {
    const {data, tableData, isBatch} = this.props
    const {config} = this.state

    if (isBatch) {
      doPrintBatch({datas: data, tableDatas: tableData, config})
    } else {
      doPrint({data, tableData, config})
    }
  }

  render () {
    const {configSelect} = this.props
    return (
      <Flex className='gm-printer-config' style={{height: '100%', width: '100%'}}>
        <Flex flex column style={{minWidth: '820px'}} className='gm-overflow-y'>
          <iframe ref={ref => { this.refIframe = ref }} style={{border: 'none', width: '100%', height: '100%'}}/>
        </Flex>
        <Flex column style={{width: '160px'}}>
          <Flex justifyBetween className='gm-padding-10'>
            {configSelect}
            <button className='btn btn-success' onClick={this.handleTestPrint}>打印</button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}

SimpleConfig.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  tableData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  config: PropTypes.object.isRequired
}

export default SimpleConfig
