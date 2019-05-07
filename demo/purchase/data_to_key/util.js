import Big from 'big.js'
import _ from 'lodash'

export const money = n => Big(n).div(100).toFixed(2)

export const toFixed2 = n => Big(n).toFixed(2)

export const getSpecialTable = (normalTable, size, type) => normalTable.reduce((arr, task) => {
  const specialList = _.chunk(task.__details, size).map(list => ({ _special: { list, type, fixedSize: size } }))
  return [...arr, task, ...specialList]
}, [])
