function toKey (data, options) {

  return {
    orders: data.details,
    category: [], // TODO
    abnormal: data.details.slice(0, 2), // TODO
    _original: data
  }
}

export {
  toKey
}
