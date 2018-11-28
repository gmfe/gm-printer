import React, { Fragment } from 'react'
import { Flex } from 'react-gm'
import { Gap, SubTitle, Title } from './component'
import PropTypes from 'prop-types'
import _ from 'lodash'
import editStore from './store'
import { observer } from 'mobx-react'

const commonFields = {
  '基础': [
    { key: '下单时间', value: '{{下单时间}}' },
    { key: '配送时间', value: '{{配送时间}}' },
    { key: '打印时间', value: '{{当前时间}}' },
    { key: '订单号', value: '{{订单号}}' },
    { key: '序号', value: '{{序号}}' },
    { key: '订单备注', value: '{{订单备注}}' },
    { key: '结款方式', value: '{{结款方式}}' },
    { key: '销售经理', value: '{{销售经理}}' },
    { key: '销售经理电话', value: '{{销售经理电话}}' }
  ],
  '配送': [
    { key: '线路', value: '{{线路}}' },
    { key: '收货商户', value: '{{收货商户}}({{商户ID}})' },
    { key: '收货人', value: '{{收货人}}' },
    { key: '收货人电话', value: '{{收货人电话}}' },
    { key: '收货地址', value: '{{收货地址}}' },
    { key: '地理标签', value: '{{城市}}{{城区}}{{街道}}' },
    { key: '商户公司', value: '{{商户公司}}' },
    { key: '承运商', value: '{{承运商}}' },
    { key: '司机名称', value: '{{司机名称}}' },
    { key: '司机电话', value: '{{司机电话}}' }

  ],
  '金额': [
    { key: '下单金额', value: '{{下单金额}}' },
    { key: '出库金额', value: '{{出库金额}}' },
    { key: '运费', value: '{{运费}}' },
    { key: '异常金额', value: '{{异常金额}}' },
    { key: '销售额(含运税)', value: '{{销售额_含运税}}' },
    { key: '税额', value: '{{税额}}' }
  ],
  '其他': [
    { key: '页码', value: '{{当前页码}} / {{页码总数}}' }
  ]
}

const tableFields = {
  '基础': [
    { key: '序号', value: '{{列.序号}}' },
    { key: '商品ID', value: '{{列.商品ID}}' },
    { key: '商品名', value: '{{列.商品名}}' },
    { key: '类别', value: '{{列.类别}}' },
    { key: '商品二级分类', value: '{{列.商品二级分类}}' },
    { key: '商品品类', value: '{{列.商品品类}}' },
    { key: 'SPU名称', value: '{{列.SPU名称}}' },
    { key: '规格', value: '{{列.规格}}' },
    { key: '税率', value: '{{列.税率}}' },
    { key: '自定义编码', value: '{{列.自定义编码}}' },
    { key: '商品描述', value: '{{列.商品描述}}' },
    { key: '备注', value: '{{列.备注}}' },
    { key: '自定义', value: '' }
  ],
  '价格': [
    { key: '不含税单价(基本单位)', value: '{{列.不含税单价_基本单位}}' },
    { key: '不含税单价(销售单位)', value: '{{列.不含税单价_销售单位}}' },
    { key: '单价(基本单位)', value: '{{列.单价_基本单位}}' },
    { key: '单价(销售单位)', value: '{{列.单价_销售单位}}' }
  ],
  '数量': [
    { key: '下单数', value: '{{列.下单数}}{{列.销售单位}}' },
    { key: '出库数(基本单位)', value: '{{列.出库数_基本单位}}{{列.基本单位}}' },
    { key: '出库数(销售单位)', value: '{{列.出库数_销售单位}}{{列.销售单位}}' }
  ],
  '金额': [
    { key: '商品税额', value: '{{列.商品税额}}' },
    { key: '出库金额', value: '{{列.出库金额}}' },
    { key: '销售额(不含税)', value: '{{列.销售额_不含税}}' }
  ],
  '异常': [
    { key: '异常原因', value: '{{列.异常原因}}' },
    { key: '异常描述', value: '{{列.异常描述}}' },
    { key: '异常数量', value: '{{列.异常数量}}' },
    { key: '异常金额', value: '{{列.异常金额}}' }

  ]
}

const FieldBtn = ({ name, onClick }) => (
  <Flex alignCenter style={{ width: '50%', margin: '3px 0' }}>
    <span className='gm-printer-edit-plus-btn' onClick={onClick}>
      +
    </span>
    <span className='gm-padding-left-5'>{name}</span>
  </Flex>
)

class FieldList extends React.Component {
  render () {
    const { fields, handleAddField } = this.props
    return (
      <div>
        <Title title='添加字段'/>
        <Gap/>
        {_.map(fields, (arr, groupName) => {
          return (
            <Fragment key={groupName}>
              <SubTitle text={groupName}/>
              <Flex wrap>
                {_.map(arr, o => <FieldBtn key={o.key} name={o.key} onClick={handleAddField.bind(this, o)}/>)}
              </Flex>
            </Fragment>
          )
        })}
      </div>
    )
  }
}

@observer
class EditorAddField extends React.Component {
  render () {
    let content = null
    if (editStore.selectedRegion === null) {
      content = null
    } else if (editStore.computedRegionIsTable) {
      content = <FieldList fields={tableFields} handleAddField={editStore.addFieldToTable}/>
    } else {
      content = <FieldList fields={commonFields} handleAddField={editStore.addFieldToPanel}/>
    }

    return <div className='gm-overflow-y'>{content}</div>
  }
}

EditorAddField.propTypes = {
  data: PropTypes.object
}

export default EditorAddField
