import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import i18next from '../../locales'
import { Flex, Select, Option } from '../components'
import { Title, Gap, Radio } from './component'

// 排序方式常量，与宿主 sort_setting_util / 后端 parse_sort_setting 对齐
// product_row_sort.field：'' 不排序 / tax_rate 税率 / box_num 箱号 / custom 行号（自定义字段）
const SORT_FIELD_LIST = [
  { value: '', text: i18next.t('不排序') },
  { value: 'tax_rate', text: i18next.t('税率') },
  { value: 'box_num', text: i18next.t('箱号') },
  { value: 'custom', text: i18next.t('行号') }
]

const SORT_DIRECTION_LIST = [
  { value: 'asc', text: i18next.t('升序') },
  { value: 'desc', text: i18next.t('降序') }
]

// order_sort.type：仅商户配送单模板提供（账户模板不渲染该组）
const ORDER_SORT_LIST = [
  { value: 'none', text: i18next.t('不排序') },
  { value: 'asc', text: i18next.t('按订单时间升序') },
  { value: 'desc', text: i18next.t('按订单时间降序') }
]

/**
 * 「排序方式」配置类：归集「商品行排序」「单据内订单顺序」两组子配置
 * 读写 editStore.config.sort_setting（mobx4 读取不存在的键不建立依赖，
 * 宿主传入 config 前需保证 sort_setting 键存在，无配置时为 null）
 */
@inject('editStore')
@observer
class SortSettingField extends React.Component {
  getProductRowSort() {
    return this.props.editStore.config.sort_setting?.product_row_sort || {}
  }

  getOrderSortType() {
    return this.props.editStore.config.sort_setting?.order_sort?.type || 'none'
  }

  setSortSetting(sortSetting) {
    this.props.editStore.config.sort_setting = sortSetting
  }

  handleFieldChange = field => {
    const productRowSort = { ...this.getProductRowSort(), field }
    if (field !== 'custom') {
      // 切离行号排序时清掉脏数据
      delete productRowSort.custom_field_key
    } else if (!productRowSort.custom_field_key) {
      // 选中「行号」默认取第一个自定义字段（行号 1）
      const customFields =
        (this.props.addFields && this.props.addFields.sortCustomFields) || []
      productRowSort.custom_field_key = customFields[0] && customFields[0].id
    }
    this.setSortSetting({
      ...this.props.editStore.config.sort_setting,
      product_row_sort: {
        ...productRowSort,
        direction: productRowSort.direction || 'asc'
      }
    })
  }

  handleDirectionChange = direction => {
    this.setSortSetting({
      ...this.props.editStore.config.sort_setting,
      product_row_sort: { ...this.getProductRowSort(), direction }
    })
  }

  handleOrderSortChange = type => {
    this.setSortSetting({
      ...this.props.editStore.config.sort_setting,
      order_sort: { type }
    })
  }

  render() {
    const { showOrderSort } = this.props
    const productRowSort = this.getProductRowSort()

    return (
      <div>
        <Title title={i18next.t('排序方式')} />
        <Gap height='5px' />
        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('商品行排序')}：</div>
          <Select
            className='gm-printer-edit-select'
            value={productRowSort.field || ''}
            onChange={this.handleFieldChange}
          >
            {_.map(SORT_FIELD_LIST, v => (
              <Option key={v.value} value={v.value}>
                {v.text}
              </Option>
            ))}
          </Select>
        </Flex>
        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('排序方向')}：</div>
          <Select
            className='gm-printer-edit-select'
            value={productRowSort.direction || 'asc'}
            onChange={this.handleDirectionChange}
          >
            {_.map(SORT_DIRECTION_LIST, v => (
              <Option key={v.value} value={v.value}>
                {v.text}
              </Option>
            ))}
          </Select>
        </Flex>
        {showOrderSort && (
          <>
            <div className='gm-padding-top-5'>
              {i18next.t('单据内订单顺序')}：
            </div>
            {_.map(ORDER_SORT_LIST, v => (
              <Radio
                key={v.value}
                id={`sort_setting_order_${v.value}`}
                value={v.text}
                inputName='sort_setting_order_sort'
                checked={this.getOrderSortType() === v.value}
                radioChecked={this.handleOrderSortChange.bind(this, v.value)}
              />
            ))}
          </>
        )}
        <Gap />
      </div>
    )
  }
}

SortSettingField.propTypes = {
  addFields: PropTypes.object.isRequired,
  showOrderSort: PropTypes.bool,
  editStore: PropTypes.object
}

SortSettingField.defaultProps = {
  showOrderSort: false
}

export default SortSettingField
