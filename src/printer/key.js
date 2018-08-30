function toKey (data, options) {

  return {
    orders: data.details,
    abnormal: [],
    _original: data
  }
}

export {
  toKey
}
