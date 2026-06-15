import _ from 'lodash'
import i18next from '../../../locales'
import { MULTI_SUFFIX } from '../../../src'

function generateTableData(list) {
  return _.map(list, (item, index) => ({
    [i18next.t('序号')]: index + 1,
    [i18next.t('样品名称')]: item.sample_name,
    [i18next.t('样品编码')]: item.sample_code,
    [i18next.t('检测结果')]: item.result,
    _origin: item
  }))
}

function generateMultiData(list) {
  const multiList = []
  let index = 0
  const len = list.length

  while (index < len) {
    const row1 = list[index]
    const row2 = {}
    if (list[1 + index]) {
      _.each(list[1 + index], (val, key) => {
        if (key !== '_origin') {
          row2[key + MULTI_SUFFIX] = val
        }
      })
    }
    multiList.push({ ...row1, ...row2 })
    index += 2
  }

  return multiList
}

const formatData = data => {
  const examiningDetail = generateTableData(data.details)

  return {
    common: {
      [i18next.t('报告编号')]: data.report_no,
      [i18next.t('报告名称')]: data.report_name,
      [i18next.t('检测机构')]: data.test_org,
      [i18next.t('检测日期')]: data.test_date,
      [i18next.t('打印时间')]: data.print_time
    },
    _table: {
      examiningDetail,
      examiningDetail_multi: generateMultiData(examiningDetail)
    },
    _origin: data
  }
}

export default formatData
