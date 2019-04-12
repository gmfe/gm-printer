import React from 'react'
import jsBarcode from 'jsbarcode'

const BarCode = props => {
  const barcode = React.createRef()
  const { value, dataName, ...rest } = props

  React.useEffect(() => {
    jsBarcode(barcode.current, value, {
      ...rest
    })
  })

  return <svg data-name={dataName} ref={barcode}/>
}

export default BarCode
