import React from 'react'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const QrCode = props => {
  const { value, size } = props
  return (
    <QRCode renderAs='svg' value={value} size={_.isFinite(size) ? size : 75} />
  )
}

QrCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}
export default QrCode
