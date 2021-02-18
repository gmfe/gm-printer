import React from 'react'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

const QrCode = (props) => {
  const { value } = props

  return (
    <QRCode
      value={`https://bshop.guanmai.cn/b/${value.orderId}/${value.customer_user_id}`}
      size={150}
    />
  )
}

QrCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}
export default QrCode
