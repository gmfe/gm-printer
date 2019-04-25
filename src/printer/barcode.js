import React from 'react'
import jsBarcode from 'jsbarcode'

class BarCode extends React.Component {
  barcode = React.createRef()
  componentDidMount () {
    const { value, ...rest } = this.props
    jsBarcode(this.barcode.current, value, {
      ...rest
    })
  }

  render () {
    const { dataName } = this.props
    return <svg data-name={dataName} ref={this.barcode}/>
  }
}

export default BarCode
