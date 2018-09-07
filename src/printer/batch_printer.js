import React from 'react'
import Printer from './printer'
import _ from 'lodash'
import PropTypes from 'prop-types'

class BatchPrinter extends React.Component {
  constructor (props) {
    super(props)
    this.ready = 0
  }

  handleReady = () => {
    this.ready++
    if (this.ready === this.props.datas.length) {
      this.props.onReady()
    }
  }

  render () {
    const {
      config,
      datas
    } = this.props

    return (
      <div>
        {_.map(datas, (v, i) => (
          <Printer
            key={i}
            data={datas[i]}
            config={config}
            onReady={this.handleReady}
          />
        ))}
      </div>
    )
  }
}

BatchPrinter.propTypes = {
  config: PropTypes.object.isRequired,
  datas: PropTypes.array,
  onReady: PropTypes.func
}

BatchPrinter.defaultProps = {
  onReady: _.noop
}

export default BatchPrinter
