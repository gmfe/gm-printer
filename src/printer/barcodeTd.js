import React from 'react'
import jsBarcode from 'jsbarcode'
import PropTypes from 'prop-types'

class BarCodeTd extends React.Component {
  barcode = React.createRef()

  componentDidMount() {
    const { value, ...rest } = this.props
    if (!value) return
    jsBarcode(this.barcode.current, value, {
      ...rest
    })
  }

  render() {
    const { dataName, value, height } = this.props
    return !value ? null : (
      <svg data-name={dataName} ref={this.barcode} style={{ height }} />
    )
  }
}

BarCodeTd.propTypes = {
  value: PropTypes.string,
  dataName: PropTypes.string,
  height: PropTypes.string
}

export default BarCodeTd
