import i18next from '../../../locales'
import moment from 'moment'
import _ from 'lodash'
import Big from 'big.js'
import { MULTI_SUFFIX, MULTI_SUFFIX3 } from '../../../src'
import {
  coverDigit2Uppercase,
  price,
  convertNumber2Sid,
  findReceiveWayById,
  combineType
} from '../../util'

const SETTLE_WAY = {
  0: '先款后货',
  1: '先货后款'
}

const PAY_STATUS = {
  1: '未支付',
  5: '部分支付',
  10: '已支付'
}

const PAY_METHOD = {
  1: '日结',
  2: '周结',
  3: '月结',
  4: '自定义结算'
}

/**
 * 生成双栏商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMultiData(list, categoryTotal) {
  const multiList = []
  // 假设skuGroup = [{a: 1}, {a:2}, {a: 3}, {a: 4}], 转化为 [{a:1, a#2:3}, {a:2, a#2: 4}]
  const skuGroup = list

  let index = 0
  const len = skuGroup.length

  while (index < len) {
    const sku1 = skuGroup[index]
    const sku2 = {}
    _.each(skuGroup[1 + index], (val, key) => {
      sku2[key + MULTI_SUFFIX] = val
    })

    multiList.push({
      ...sku1,
      ...sku2
    })

    index += 2
  }

  if (categoryTotal) {
    multiList.push(categoryTotal)
  }

  return multiList
}

function generateMultiData2(list, categoryTotal) {
  const multiList = []
  // 假设skuGroup = [{a: 1}, {a:2}, {a: 3}, {a: 4}], 转化为 [{a:1, a#2:3}, {a:2, a#2: 4}]
  const skuGroup = list

  let index = 0
  const len = skuGroup.length
  const middle = Math.ceil(len / 2)

  while (index < middle) {
    const sku1 = skuGroup[index]
    const sku2 = {}
    _.each(skuGroup[middle + index], (val, key) => {
      sku2[key + MULTI_SUFFIX] = val
    })

    multiList.push({
      ...sku1,
      ...sku2
    })

    index += 1
  }

  if (categoryTotal) {
    multiList.push(categoryTotal)
  }

  return multiList
}

function getOrgItemPrice(list) {
  let totalOrgItemPrice = Big(0)
  _.each(list, v => {
    totalOrgItemPrice = totalOrgItemPrice.plus(v.org_item_price)
  })
  return totalOrgItemPrice
}

// 非表格数据
function generateCommon(data) {
  return {
    barcode: data.id,
    qrcode: data.food_security_code,
    signature_image_url: data.signature_image_url,

    订单号: data.id,
    分拣序号: `${data.sort_id} ${data.child_sort_id}`,
    支付状态: PAY_STATUS[data.pay_status],

    下单时间: moment(data.date_time).format('YYYY-MM-DD HH:mm:ss'),
    下单时间_日期: moment(data.date_time).format('YYYY-MM-DD'),
    下单时间_时间: moment(data.date_time).format('HH:mm:ss'),
    配送时间: `${moment(data.receive_begin_time).format(
      'MM-DD HH:mm:ss'
    )} ~ ${moment(data.receive_end_time).format('MM-DD HH:mm:ss')}`,
    配送时间_日期: `${moment(data.receive_begin_time).format(
      'MM-DD'
    )} ~ ${moment(data.receive_end_time).format('MM-DD')}`,
    配送时间_时间: `${moment(data.receive_begin_time).format(
      'HH:mm:ss'
    )} ~ ${moment(data.receive_end_time).format('HH:mm:ss')}`,
    当前时间: moment().format('YYYY-MM-DD HH:mm:ss'),
    当前时间_日期: moment().format('YYYY-MM-DD'),
    当前时间_时间: moment().format('HH:mm:ss'),
    订单备注: data.remark,
    收货时间: `${moment(data.receive_begin_time).format(
      'YYYY-MM-DD HH:mm:ss'
    )} ~ ${moment(data.receive_end_time).format('YYYY-MM-DD HH:mm:ss')}`,
    结款周期: PAY_METHOD[data.pay_method.pay_method] || '',
    授信额度: price(data.credit_limit),
    箱数: data.order_box_count,
    下单金额: price(data.total_price),
    优惠金额: price(data.coupon_amount),
    出库金额: price(data.real_price),
    运费: price(data.freight),
    异常金额: price(Big(data.abnormal_money).plus(data.refund_money)),
    销售额_含运税: price(data.total_pay),

    税额: price(data.total_tax), // 商品税额加总

    商户公司: data.cname,
    承运商: data.carrier,
    结款方式: SETTLE_WAY[data.settle_way],

    线路: data.address_route_name || '-',
    城市: data.city || '-',
    城区: data.area_l1 || '-',
    街道: data.area_l2 || '-',

    司机名称: data.driver_name || '-',
    司机电话: data.driver_phone || '-',
    销售经理: data.sale_manager.name || '-',
    销售经理电话: data.sale_manager.phone || '-',

    // 收货人信息
    收货商户: data.resname,
    商户自定义编码: data.res_custom_code,
    商户ID: convertNumber2Sid(data.sid),
    收货人: data.receiver_name,
    收货人电话: data.receiver_phone,
    收货地址: data.address,

    下单账号: data.username,
    打印人: data.printer_operator,
    下单员: data.create_user,
    收货方式: findReceiveWayById(data.receive_way),
    自提点名称: data.pick_up_st_name,
    自提点负责人: data.pick_up_st_principal,
    自提点联系方式: data.pick_up_st_phone
  }
}

// 大写金额数据
function generateUpperPrice(data, totalOrgItemPrice) {
  return {
    下单金额_大写: coverDigit2Uppercase(data.total_price),
    优惠金额_大写: coverDigit2Uppercase(data.coupon_amount),
    出库金额_大写: coverDigit2Uppercase(data.real_price),
    运费_大写: coverDigit2Uppercase(data.freight),
    异常金额_大写: coverDigit2Uppercase(data.abnormal_money),
    销售额_含运税_大写: coverDigit2Uppercase(data.total_pay),

    商品税额_大写: coverDigit2Uppercase(data.total_tax), // 商品税额加总

    // 原总金额
    原总金额_大写: coverDigit2Uppercase(totalOrgItemPrice)
  }
}

// 商品统计数据(一些汇总之类的数据)
function generateSummary(list) {
  let quantityTotal = Big(0)
  let realWeightSaleUnitTotal = Big(0)
  _.each(list, v => {
    quantityTotal = quantityTotal.plus(v.quantity || 0)

    const realWeightSaleUnit = Big(v.real_weight || 0).div(v.sale_ratio)
    realWeightSaleUnitTotal = realWeightSaleUnitTotal.plus(realWeightSaleUnit)
  })
  // 😂前方高能.  汇总是什么鬼.每个商品的单位很可能不一样! 😇👍但是客户想要!因为他只卖猪肉!单位都一致🤢
  return {
    下单总数_销售单位: parseFloat(quantityTotal.toFixed(2)),
    出库总数_销售单位: parseFloat(realWeightSaleUnitTotal.toFixed(2))
  }
}

// 普通订单数据
function generateOrderData(list, data) {
  // 异常商品
  const abnormalSku = _.map(data.abnormals, v => {
    const isSku = v.detail_id !== '0' // 非商品异常detail_id为 '0'
    return {
      异常原因: v.type_text,
      异常描述: v.text,
      异常数量: isSku ? v.amount_delta : '-',
      异常金额: price(v.money_delta),
      售后类型: isSku ? '商品异常' : '非商品异常',
      ...v
    }
  })
  // 退货商品
  const refunds = _.map(data.refunds, v => {
    return {
      异常原因: v.type_text,
      异常描述: v.text,
      异常数量: v.amount_delta,
      异常金额: price(v.money_delta),
      售后类型: '退货',
      ...v
    }
  })
  // 异常商品+退货商品  对象集合
  const abnormalObject = _.reduce(
    [...abnormalSku, ...refunds],
    (res, cur) => {
      res[cur.detail_id] = cur
      return res
    },
    {}
  )

  return _.map(list, (v, index) => {
    return {
      ...abnormalObject[v.id],
      序号: index + 1,
      商品ID: v.id,
      商品名: v.real_is_weight && !v.is_weigh ? `*${v.name}` : v.name,
      商品名_无星号: v.name,
      类别: v.category_title_1,
      商品二级分类: v.category_title_2,
      商品品类: v.pinlei_title,
      SPU名称: v.spu_name,
      规格:
        v.std_unit_name_forsale === v.sale_unit_name && v.sale_ratio === 1
          ? `按${v.sale_unit_name}`
          : `${v.sale_ratio}${v.std_unit_name_forsale}/${v.sale_unit_name}`,
      自定义编码: v.outer_id,
      商品描述: v.desc,
      备注: v.remark, // 商品备注
      箱号: _.join(
        _.map(v.box_list, box => box.box_no),
        ','
      ),
      基本单位: v.std_unit_name_forsale,
      销售单位: v.sale_unit_name,

      /* ----下面4个[数量]字段: 如果是0,那么显示为空 --- */
      下单数: v.quantity || '',
      出库数_基本单位: v.real_weight || '',
      出库数_销售单位: v.real_weight
        ? parseFloat(
            Big(v.real_weight)
              .div(v.sale_ratio)
              .toFixed(2)
          )
        : '',
      称重数_销售单位: v.saleunit_weighting_quantity || v.quantity || '',
      /* ------------ */

      税率: v.is_set_tax
        ? `${Big(v.tax_rate || 0)
            .div(100)
            .toFixed(2)}%`
        : i18next.t('未设置'),
      不含税单价_基本单位: price(
        Big(v.sale_price_without_tax || 0).div(v.sale_ratio)
      ),
      不含税单价_销售单位: price(v.sale_price_without_tax),
      单价_基本单位: price(v.std_sale_price_forsale),
      单价_销售单位: price(v.sale_price),
      单价_基本单位_时价:
        price(v.std_sale_price_forsale) || '<strong>时价</strong>',
      单价_销售单位_时价: price(v.sale_price) || '<strong>时价</strong>',

      原单价_基本单位: price(v.org_std_sale_price_forsale),
      原单价_销售单位: price(v.org_sale_price),
      原金额: price(v.org_item_price),

      商品税额: Big(v.tax || 0).toFixed(2),
      出库金额: price(v.real_item_price),
      出库金额_不含税: price(v.real_item_price_without_tax),
      下单金额: price(Big(v.sale_price).times(v.quantity || 0)),

      生产日期: v.production_time || '-',
      保质期: v.life_time || '-',
      默认供应商: v.supplier_name,

      _origin: v
    }
  })
}

// 组合商品表
function combinationData(data) {
  // 组合商品
  const combination = _.map(data.combine_goods, (v, index) => {
    return {
      序号: ++index,
      组合商品名: v.name,
      类型: combineType(v.type),
      下单数: v.quantity,
      销售单位: v.sale_unit_name,
      含税单价_销售单位: price(v.unit_price),
      下单金额_参考金额: price(v.money),
      _origin: v
    }
  })
  return [...combination]
}

// 周转物表格
function turnoverData(data) {
  const turnover = _.map(data.turnovers, (v, index) => {
    return {
      序号: ++index,
      周转物名称: v.tname,
      单位: v.unit_name,
      单个货值: price(v.price),
      预借出数: v.apply_amount,
      借出数: v.amount,
      货值: price(v.total_price),
      关联商品: v.sku_name
    }
  })
  return [...turnover]
}

/**
 * 生成 三栏+纵向 三栏+分类+纵向 商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMulti3Data2(list, categoryTotal) {
  const multiList = []
  // 假设skuGroup = [{a: 1}, {a:2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], 转化为 [{a:1, a#2:3, a#3:5}, {a:2, a#2:4 a#3:6}]
  const skuGroup = [...list]

  let index = 0
  const len = skuGroup.length
  const middle = Math.ceil(len / 3)
  const splitList = []
  // 整理成 splitList   ==== [[{}...],[[{}...],[[{}...]]
  while (index < Math.ceil(len / middle)) {
    splitList.push(skuGroup.splice(0, middle))
    index++
  }
  let sku1 = []
  const sku2 = []
  const sku3 = []

  // splitList[0] 保持不变
  // splitList[1]里的对象所有的key添加 MULTI_SUFFIX
  // splitList[2]里的对象添加 MULTI_SUFFIX3
  _.forEach(splitList, (item, index) => {
    if (index === 0) {
      sku1 = item
    }
    if (index === 1) {
      const skuList = []
      _.each(item, (i, ind) => {
        _.each(i, (val, key) => {
          skuList[key + MULTI_SUFFIX] = val
        })
        sku2.push({ ...skuList })
      })
    }
    if (index === 2) {
      const skuList = []
      _.each(item, (i, ind) => {
        _.each(i, (val, key) => {
          skuList[key + MULTI_SUFFIX3] = val
        })
        sku3.push({ ...skuList })
      })
    }
  })
  // 整理成 [ { 序号:1, 序号_MULTI_SUFFIX:x, 序号_MULTI_SUFFIX3:x } ,{...}]
  _.forEach(sku1, (item, index) => {
    multiList.push({ ...sku1[index], ...sku2[index], ...sku3[index] })
  })

  // 添加上分类
  if (categoryTotal) {
    multiList.push(categoryTotal)
  }

  return multiList
}

/**
 * 生成三栏商品展示数据
 * @param list
 * @param categoryTotal
 * @return {Array}
 */
function generateMulti3Data(list, categoryTotal) {
  const multiList = []
  // 假设skuGroup = [{a: 1}, {a:2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}], 转化为 [{a:1, a#2:2, a#3:3}, {a:4, a#2:5 a#3:6}]
  const skuGroup = list

  let index = 0
  const len = skuGroup.length

  while (index < len) {
    const sku1 = skuGroup[index]
    const sku2 = {}
    const sku3 = {}

    _.each(skuGroup[1 + index], (val, key) => {
      sku2[key + MULTI_SUFFIX] = val
    })
    _.each(skuGroup[2 + index], (val, key) => {
      sku2[key + MULTI_SUFFIX3] = val
    })
    multiList.push({
      ...sku1,
      ...sku2,
      ...sku3
    })

    index += 3
  }

  if (categoryTotal) {
    multiList.push(categoryTotal)
  }

  return multiList
}

/**
 * 获取售后汇总和明细数据
 * @param {object} data 含exception,refund,no_sku_exceptions的data
 * @return {object: {totalData,exception,refund,no_sku_exceptions,}}
 */
function getExceptionAndRefund(data) {
  const totalData = {
    exception: {},
    refund: {},
    no_sku_exceptions: []
  }
  const exception = {}
  const refund = {}
  const no_sku_exceptions = []

  // 商品异常
  if (data.exception_new) {
    for (const [key, value] of Object.entries(data.exception_new)) {
      let totalNum = 0
      let totalMoney = 0
      _.each(value, item => {
        /** 处理明细 */
        if (!exception[key]) {
          exception[key] = []
        }

        exception[key].push({
          异常原因: item.exception_reason_text,
          异常描述: item.text,
          异常数量: item.amount_delta,
          异常金额: price(item.money_delta),
          售后类型: '商品异常',
          abnormalNumber: item.amount_delta,
          _origin: item
        })

        /** 处理汇总 */
        if (!totalData.exception[key]) {
          totalData.exception[key] = [{ _origin: item }]
        }

        if (value.length > 1) {
          Object.assign(totalData.exception[key][0], {
            异常原因: '-',
            异常描述: '-',
            售后类型: '商品异常'
          })
        } else if (value.length === 1) {
          Object.assign(totalData.exception[key][0], exception[key][0]) // 取第一条数据就好
        }
        totalNum = +Big(item.amount_delta).plus(totalNum)
        totalMoney = +Big(item.money_delta).plus(totalMoney)
      })

      Object.assign(totalData.exception[key][0], {
        异常数量: totalNum,
        异常金额: price(totalMoney),
        abnormalNumber: totalNum
      })
    }
  }

  // 非商品异常
  if (data.no_sku_exceptions) {
    _.each(data.no_sku_exceptions, value => {
      no_sku_exceptions.push({
        异常原因: value.exception_reason_text,
        异常描述: value.text,
        异常数量: '-',
        异常金额: price(value.money_delta),
        售后类型: '非商品异常',
        _origin: value
      })
      totalData.no_sku_exceptions.push({
        异常原因: value.exception_reason_text,
        异常描述: value.text,
        异常数量: '-',
        异常金额: price(value.money_delta),
        售后类型: '非商品异常',
        _origin: value
      })
    })
  }
  // 退货
  if (data.refund_new) {
    for (const [key, value] of Object.entries(data.refund_new)) {
      let totalNum = 0
      let totalMoney = 0
      _.each(value, item => {
        /** 处理明细 */
        if (!refund[key]) {
          refund[key] = []
        }

        refund[key].push({
          异常原因: item.exception_reason_text,
          异常描述: item.text,
          异常数量: item.amount_delta,
          异常金额: price(item.money_delta),
          售后类型: '退货',
          refundNumber: item.amount_delta,
          _origin: item
        })

        /** 处理汇总 */
        if (!totalData.refund[key]) {
          totalData.refund[key] = [{ _origin: item }]
        }

        if (value.length > 1) {
          Object.assign(totalData.refund[key][0], {
            异常原因: '-',
            异常描述: '-',
            售后类型: '退货'
          })
        } else if (value.length === 1) {
          Object.assign(totalData.refund[key][0], refund[key][0]) // 取第一条数据就好
        }
        totalNum = +Big(item.amount_delta).plus(totalNum)
        totalMoney = +Big(item.money_delta).plus(totalMoney)
      })
      Object.assign(totalData.refund[key][0], {
        异常数量: totalNum,
        异常金额: price(totalMoney),
        refundNumber: totalNum
      })
    }
  }

  return {
    totalData,
    exception,
    refund,
    no_sku_exceptions
  }
}

// 异常商品表单
function generateAbnormalData(data, kOrders, isDetail) {
  const { refund, exception, no_sku_exceptions } = isDetail
    ? getExceptionAndRefund(data)
    : getExceptionAndRefund(data).totalData
  const refunds = []
  const abnormals = []
  const no_sku = []

  _.each(kOrders, item => {
    const _idIndex =
      item._origin.detail_id === undefined
        ? item._origin.id
        : item._origin.id + '_' + item._origin.detail_id
    if (exception[_idIndex]) {
      _.each(exception[_idIndex], exc => {
        abnormals.push({ ...item, ...exc })
      })
    }

    if (refund[_idIndex]) {
      _.each(refund[_idIndex], ref => {
        refunds.push({ ...item, ...ref })
      })
    }
  })

  _.each(no_sku_exceptions, item => {
    no_sku.push({
      ...item,
      商品名: '-'
    })
  })

  // 异常表单 = 退货商品 + 异常商品 + 非商品异常
  return [...abnormals, ...refunds, ...no_sku]
}

// 积分表格
function generateRewardData(list) {
  return _.map(list, o => ({
    积分商品名: o.sku_name,
    规格: o.sale_unit,
    兑换数: o.quantity,
    消耗积分: o.total_cost_point
  }))
}

function order(data) {
  // 商品列表
  const skuList = data.details

  // 组合商品表
  const combination = combinationData(data)

  // 周转物表格
  const turnover = turnoverData(data)

  /* ----------- 普通  ------------ */
  const kOrders = generateOrderData(skuList, data)
  /* ----------- 双栏 -------------- */
  const kOrdersMulti = generateMultiData(kOrders)
  /* ----------- 双栏 (纵向)-------------- */
  const kOrdersMultiVertical = generateMultiData2(kOrders)
  /* ----------- 三栏 -------------- */
  const kOrdersMulti3 = generateMulti3Data(kOrders)
  /* ----------- 三栏 (纵向)-------------- */
  const kOrdersMulti3Vertical = generateMulti3Data2(kOrders)

  // 按一级分类分组
  const groupByCategory1 = _.groupBy(kOrders, v => v._origin.category_title_1)

  /* -------- 分类 和 双栏 + 分类 ------- */
  let kCategory = []
  let kCategoryDiy = []
  let kCategoryAndDiy = []
  let kCategoryMulti = []
  let kCategoryMultiDiy = []
  let kCategoryMultiAndDiy = []
  let kCategoryMultiVertical = []
  let kCategoryMultiVerticalDiy = []
  let kCategoryMultiVerticalAndDiy = []
  let kCategoryMulti3 = []
  let kCategoryMulti3Diy = []
  let kCategoryMulti3AndDiy = []
  let kCategoryMulti3Vertical = []
  let kCategoryMulti3VerticalDiy = []
  let kCategoryMulti3VerticalAndDiy = []
  const kCounter = [] // 分类汇总

  let index = 1
  _.forEach(groupByCategory1, (value, key) => {
    // 分类小计
    let subtotal = Big(0)
    // 下单金额
    let subTotalPrice = Big(0)
    // 实际金额
    let subAccountPrice = Big(0)
    const list = _.map(value, sku => {
      subtotal = subtotal.plus(sku._origin.real_item_price)
      subTotalPrice = subTotalPrice.plus(sku._origin.total_item_price)
      // 没有这个字段，则设置为0
      subAccountPrice = subAccountPrice.plus(sku._origin.account_price || 0)
      return {
        ...sku,
        序号: index++
      }
    })
    subtotal = subtotal.toFixed(2)
    subTotalPrice = subTotalPrice.toFixed(2)
    subAccountPrice = subAccountPrice.toFixed(2)
    const categoryTotal = {
      _special: {
        text: `${key}小计：${subTotalPrice}`,
        ...getTotalAmount(key, {
          subtotal,
          subTotalPrice,
          subAccountPrice
        })
      }
    }
    const diyCategoryTotal = {
      _diyCategorySubtotal: true,
      _originalIndex: index - 1
    }


    // 商品分类汇总数组
    kCounter.push({ text: key, len: value.length, subtotal })

    /* -------- 分类  ------------- */
    kCategory = kCategory.concat(list, categoryTotal)
    kCategoryDiy = kCategoryDiy.concat(list, diyCategoryTotal)
    kCategoryAndDiy = kCategoryAndDiy.concat(
      list,
      categoryTotal,
      diyCategoryTotal
    )
    /* -------- 双栏 + 分类 ------- */
    kCategoryMulti = kCategoryMulti.concat(
      generateMultiData(list, categoryTotal)
    )
    kCategoryMultiDiy = kCategoryMultiDiy.concat(
      generateMultiData(list, diyCategoryTotal)
    )
    kCategoryMultiAndDiy = kCategoryMultiAndDiy.concat(
      generateMultiData(list, categoryTotal, diyCategoryTotal)
    )
    /* -------- 双栏 + 分类（纵向） ------- */
    kCategoryMultiVertical = kCategoryMultiVertical.concat(
      generateMultiData2(list, categoryTotal)
    )
    kCategoryMultiVerticalDiy = kCategoryMultiVerticalDiy.concat(
      generateMultiData2(list, diyCategoryTotal)
    )
    kCategoryMultiVerticalAndDiy = kCategoryMultiVerticalDiy.concat(
      generateMultiData2(list, categoryTotal, diyCategoryTotal)
    )
    /* -------- 三栏 + 分类 ------- */
    kCategoryMulti3 = kCategoryMulti3.concat(
      generateMulti3Data(list, categoryTotal)
    )
    kCategoryMulti3Diy = kCategoryMulti3Diy.concat(
      generateMulti3Data(list, diyCategoryTotal)
    )
    kCategoryMulti3AndDiy = kCategoryMulti3AndDiy.concat(
      generateMulti3Data(list, categoryTotal, diyCategoryTotal)
    )
    /* -------- 三栏 + 分类（纵向） ------- */
    kCategoryMulti3Vertical = kCategoryMulti3Vertical.concat(
      generateMulti3Data2(list, categoryTotal)
    )
    kCategoryMulti3VerticalDiy = kCategoryMulti3VerticalDiy.concat(
      generateMulti3Data2(list, diyCategoryTotal)
    )
    kCategoryMulti3VerticalAndDiy = kCategoryMulti3VerticalAndDiy.concat(
      generateMulti3Data2(list, categoryTotal, diyCategoryTotal)
    )
  })

  const totalOrgItemPrice = getOrgItemPrice(skuList)

  return {
    common: {
      ...generateCommon(data),
      ...generateSummary(skuList),
      ...generateUpperPrice(data, totalOrgItemPrice),
      原总金额: price(totalOrgItemPrice)
    },
    _counter: kCounter, // 分类商品统计
    _table: {
      orders: kOrders, // 普通
      orders_multi: kOrdersMulti, // 双栏
      orders_multi_vertical: kOrdersMultiVertical, // 双栏（纵向）
      orders_category: kCategory, // 分类
      orders_category_multi: kCategoryMulti, // 分类 + 双栏
      orders_category_multi3: kCategoryMulti3, // 分类 + 三栏
      orders_category_multi_vertical: kCategoryMultiVertical, // 分类+双栏（纵向）
      orders_category_multi3_vertical: kCategoryMulti3Vertical, // 分类+三栏（纵向）

      orders_categoryDiy: kCategoryDiy, // 自定义分类
      orders_category_categoryDiy: kCategoryAndDiy, // 分类 + 自定义分类

      orders_categoryDiy_multi: kCategoryMultiDiy, // 自定义分类 + 双栏
      orders_category_multi_and_diy: kCategoryMultiAndDiy, // 分类 + 双栏 + 自定义分类

      orders_category_multi_vertical_diy: kCategoryMultiVerticalDiy, // 自定义分类 + 双栏（纵向）
      orders_category_multi_vertical_and_diy: kCategoryMultiVerticalAndDiy, // 分类 + 双栏（纵向） + 自定义分类

      orders_category_multi3_diy: kCategoryMulti3Diy, // 自定义分类 + 三栏
      orders_category_multi3_and_diy: kCategoryMulti3AndDiy, // 分类 + 三栏 + 自定义分类

      orders_category_multi3_vertical_diy: kCategoryMulti3VerticalDiy, // 自定义分类 + 三栏（纵向）
      orders_category_multi3_vertical_and_diy: kCategoryMulti3VerticalAndDiy, // 分类 + 三栏（纵向） + 自定义分类

      abnormal: generateAbnormalData(data, kOrders), // 异常明细
      reward: generateRewardData(data.reward_sku_list),
      combination: combination, // 组合商品
      turnover // 周转物
    },
    _origin: data
  }
}

/**
 * 获取合计金额数据
 * @param key
 * @param options subtotal 出库金额， subTotalPrice 下单金额， subAccountPrice 实际金额
 * @returns {{出库金额: {text: string, upperCaseText: string, upperCaseBefore: string, upperLowerCaseSeparate: string}, 下单金额: {text: string, upperCaseText: string, upperCaseBefore: string, upperLowerCaseSeparate: string}, 实际金额: {text: string, upperCaseText: string, upperCaseBefore: string, upperLowerCaseSeparate: string}}}
 */
function getTotalAmount(key, options) {
  const { subtotal = 0, subTotalPrice = 0, subAccountPrice = 0 } = options
  return {
    出库金额: {
      text: `${key}小计：${subtotal}`,
      upperCaseText: `${key}小计：${subtotal}&nbsp;&nbsp;&nbsp;大写：${coverDigit2Uppercase(
        subtotal
      )}`,
      upperCaseBefore: `${key}小计：${coverDigit2Uppercase(
        subtotal
      )}&nbsp;&nbsp;&nbsp;${subtotal}`,
      upperLowerCaseSeparate: `<div>${key}小计：${coverDigit2Uppercase(
        subtotal
      )}</div><div>${subtotal}</div>`
    },
    下单金额: {
      text: `${key}小计：${subTotalPrice}`,
      upperCaseText: `${key}小计：${subTotalPrice}&nbsp;&nbsp;&nbsp;大写：${coverDigit2Uppercase(
        subTotalPrice
      )}`,
      upperCaseBefore: `${key}小计：${coverDigit2Uppercase(
        subTotalPrice
      )}&nbsp;&nbsp;&nbsp;${subTotalPrice}`,
      upperLowerCaseSeparate: `<div>${key}小计：${coverDigit2Uppercase(
        subTotalPrice
      )}</div><div>${subTotalPrice}</div>`
    },
    实际金额: {
      text: `${key}小计：${subAccountPrice}`,
      upperCaseText: `${key}小计：${subAccountPrice}&nbsp;&nbsp;&nbsp;大写：${coverDigit2Uppercase(
        subAccountPrice
      )}`,
      upperCaseBefore: `${key}小计：${coverDigit2Uppercase(
        subAccountPrice
      )}&nbsp;&nbsp;&nbsp;${subAccountPrice}`,
      upperLowerCaseSeparate: `<div>${key}小计：${coverDigit2Uppercase(
        subAccountPrice
      )}</div><div>${subAccountPrice}</div>`
    }
  }
}

export default order
