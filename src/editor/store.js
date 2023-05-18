import EditorStore from '../common/editor_store'
import i18next from '../../locales'

class Store extends EditorStore {
  // 复写父类方法
  setTableDataKeyEffect(target, dataKey) {
    switch (dataKey) {
      case 'combination': {
        target.columns = [
          {
            head: i18next.t('序号'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.序号}}')
          },
          {
            head: i18next.t('组合商品名'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.组合商品名}}')
          },
          {
            head: i18next.t('类型'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.类型}}')
          },
          {
            head: i18next.t('下单数'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.下单数}}')
          },
          {
            head: i18next.t('销售单位'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.销售单位}}')
          },
          {
            head: i18next.t('含税单价(销售单位)'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.含税单价_销售单位}}')
          },
          {
            head: i18next.t('下单金额(参考金额)'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.下单金额_参考金额}}')
          }
        ]
        break
      }
      case 'reward': {
        target.columns = [
          {
            head: i18next.t('积分商品名'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.积分商品名}}')
          },
          {
            head: i18next.t('规格'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.规格}}')
          },
          {
            head: i18next.t('兑换数'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.兑换数}}')
          },
          {
            head: i18next.t('消耗积分'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.消耗积分}}')
          }
        ]
        break
      }
      case 'abnormal': {
        target.columns = [
          {
            head: i18next.t('商品名'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.商品名}}')
          },
          {
            head: i18next.t('异常原因'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.异常原因}}')
          },
          {
            head: i18next.t('异常数量'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.异常数量}}')
          },
          {
            head: i18next.t('异常金额'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.异常金额}}')
          }
        ]
        break
      }
      case 'orders': {
        target.columns = [
          {
            head: i18next.t('序号'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.序号}}')
          },
          {
            head: i18next.t('类别'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.类别}}')
          },
          {
            head: i18next.t('商品名'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.商品名}}')
          },
          {
            head: i18next.t('规格'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.规格}}')
          },
          {
            head: i18next.t('下单数'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.下单数}}{{列.销售单位}}')
          },
          {
            head: i18next.t('出库数(基本单位)'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.出库数_基本单位}}{{列.基本单位}}')
          },
          {
            head: i18next.t('单价(基本单位)'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.单价_基本单位}}')
          },
          {
            head: i18next.t('出库金额'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.出库金额}}')
          }
        ]
        break
      }
      case 'turnover': {
        target.columns = [
          {
            head: i18next.t('序号'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.序号}}')
          },
          {
            head: i18next.t('周转物名称'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.周转物名称}}')
          },
          {
            head: i18next.t('单位'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.单位}}')
          },
          {
            head: i18next.t('关联商品'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.关联商品}}')
          },
          {
            head: i18next.t('单个货值'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.单个货值}}')
          },
          {
            head: i18next.t('预借出数'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.预借出数}}')
          },
          {
            head: i18next.t('借出数'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.借出数}}')
          },
          {
            head: i18next.t('货值'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.货值}}')
          },
          {
            head: i18next.t('周转物数量更正'),
            headStyle: {
              textAlign: 'center'
            },
            style: {
              textAlign: 'center'
            },
            text: i18next.t('{{列.周转物数量更正}}')
          }
        ]
        break
      }
      default:
    }
  }
}

export default new Store()
