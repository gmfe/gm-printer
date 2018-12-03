import { i18next } from 'gm-i18n'
import _ from 'lodash'
import Big from 'big.js'

export const coverDigit2Uppercase = n => {
  if (_.isNil(n) || _.isNaN(n)) {
    return '-'
  }

  const fraction = [i18next.t('角'), i18next.t('分')]

  const digit = [
    i18next.t('零'), i18next.t('壹'), i18next.t('贰'), i18next.t('叁'), i18next.t('肆'),
    i18next.t('伍'), i18next.t('陆'), i18next.t('柒'), i18next.t('捌'), i18next.t('玖')
  ]

  const unit = [
    [i18next.t('元'), i18next.t('万'), i18next.t('亿')],
    ['', i18next.t('拾'), i18next.t('佰'), i18next.t('仟')]
  ]

  const head = n < 0 ? i18next.t('欠') : ''

  n = Math.abs(n)

  let left = ''
  let right = ''
  let i = 0
  for (i; i < fraction.length; i++) {
    right += digit[Math.floor(Big(n).times(Big(10).pow(i + 1)).mod(10).toString())] + fraction[i]
  }

  right = right.replace(/(零.)+$/, '').replace(/(零.)/, i18next.t('零')) || i18next.t('整')

  n = Math.floor(n)

  for (i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    left = p.replace(/(零.)*零$/, '').replace(/^$/, i18next.t('零')) + unit[0][i] + left
  }

  return head + (left.replace(/(零.)*零元/, i18next.t('元')).replace(/(零.)+/g, i18next.t('零')) + right).replace(/^整$/, i18next.t('零元整'))
}

// 12 => S000012  ,  1232131 => S1232131  sid显示,不足6位补足
export const convertNumber2Sid = (id) => {
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
