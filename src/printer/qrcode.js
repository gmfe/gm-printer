import React from 'react'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'

const QrCode = props => {
  const { value } = props
  return <QRCode value={value} size={75} />
}

QrCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}
export default QrCode
