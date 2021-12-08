import React from 'react'
import jsBarcode from 'jsbarcode'
import PropTypes from 'prop-types'

class BarCode extends React.Component {
  barcode = React.createRef()

  componentDidMount() {
    const { value, ...rest } = this.props
    jsBarcode(this.barcode.current, value, {
      ...rest
    })
  }

  render() {
    const { dataName } = this.props
    return <svg data-name={dataName} ref={this.barcode} />
  }
}

BarCode.propTypes = {
  value: PropTypes.string,
  dataName: PropTypes.string
}

export default BarCode
