import _ from 'lodash'
import Big from 'big.js'
import i18next from '../locales'

export const coverDigit2Uppercase = n => {
  if (_.isNil(n) || _.isNaN(n)) {
    return '-'
  }

  const fraction = ['角', '分']

  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']

  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]

  const head = n < 0 ? '欠' : ''

  n = Math.abs(n)

  let left = ''
  let right = ''
  let i = 0
  for (i; i < fraction.length; i++) {
    right +=
      digit[
        Math.floor(
          Big(n)
            .times(Big(10).pow(i + 1))
            .mod(10)
            .toString()
        )
      ] + fraction[i]
  }

  right = right.replace(/(零.)+$/, '').replace(/(零.)/, '零') || '整'

  n = Math.floor(n)

  for (i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    left = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + left
  }

  return (
    head +
    (left.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零') + right).replace(
      /^整$/,
      '零元整'
    )
  )
}

// 12 => S000012  ,  1232131 => S1232131  sid显示,不足6位补足
export const convertNumber2Sid = id => {
  if (/^\d+$/.test(id)) {
    id = parseInt(id, 10)
    if (id > 1000000) {
      return 'S' + id
    } else {
      return 'S' + (1000000 + id + '').slice(1)
    }
  } else {
    return id
  }
}

export const price = n => Big(n || 0).toFixed(2)

const RECEIVE_WAYS = [
  { value: 1, name: '配送' },
  { value: 2, name: '自提' }
]

export const findReceiveWayById = id => {
  const target = _.find(RECEIVE_WAYS, item => item.value === id)
  return (target && target.name) || ''
}

export const isNumber = value => {
  return value !== null && value !== '' && !_.isNaN(Number(value))
}

// 出库状态
export const outStockStatusMap = {
  1: i18next.t('待出库'),
  2: i18next.t('已出库'),
  3: i18next.t('已删除')
}
