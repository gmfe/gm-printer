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
    if (this.ready === this.props.list.length) {
      this.props.onReady()
    }
  }

  render () {
    const { list } = this.props

    return (
      <div>
        {_.map(list, ({ config, data }, i) => (
          <Printer
            key={i}
            data={data}
            config={config}
            onReady={this.handleReady}
          />
        ))}
      </div>
    )
  }
}

BatchPrinter.propTypes = {
  list: PropTypes.array.isRequired,
  onReady: PropTypes.func
}

BatchPrinter.defaultProps = {
  onReady: _.noop
}

export default BatchPrinter
