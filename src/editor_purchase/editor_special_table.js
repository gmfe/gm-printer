import i18next from '../../locales'
import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Option, Select } from '../components/index'
import {
  Gap,
  Title,
  FieldBtn,
  Textarea,
  TipInfo,
  Fonter,
  Separator,
  TextAlign
} from '../common/component'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'

const dataKeyList = [
  { value: 'purchase_no_detail', text: i18next.t('不打印明细') },
  { value: 'purchase_last_col', text: i18next.t('单列-总表最后一列（换行）') },
  {
    value: 'purchase_last_col_noLineBreak',
    text: i18next.t('单列-总表最后一列（不换行）')
  },
  { value: 'purchase_one_row', text: i18next.t('单列-总表下方一行') },
  { value: 'purchase_flex_2', text: i18next.t('双栏-总表下方一行两栏') },
  { value: 'purchase_flex_4', text: i18next.t('四栏-总表下方一行四栏') },
  { value: 'purchase_detail_one_row', text: i18next.t('按采购明细单行') }
]

const purchasePrintSettingDataKeyList = [
  { value: 'goods', text: i18next.t('按商品排序') },
  { value: 'merchant', text: i18next.t('按商户排序') }
]

// 明细行排序候选值 - 按「打印设置=按商品排序」时使用
// 此时明细行是同商品下的商户维度，按商户自定义编码排序
// value 与后端 DetailSortType 枚举对齐(int)
// 模板字段名: detail_sort_type
// 注:value=0 的 UI 文案用「创建时间降序」(等于 DEFAULT,现有规则),
// 跟 stationv3 前端弹窗的候选文案 + 需求文档保持一致
const detailSortOptionsForGoods = [
  { value: 0, text: i18next.t('创建时间降序') },
  { value: 1, text: i18next.t('按商户自定义编码升序') },
  { value: 2, text: i18next.t('按商户自定义编码降序') }
]

// 明细行排序候选值 - 按「打印设置=按商户排序」时使用
// 此时明细行是同商户下的规格维度，按规格自定义编码排序
const detailSortOptionsForMerchant = [
  { value: 0, text: i18next.t('创建时间降序') },
  { value: 3, text: i18next.t('按规格自定义编码升序') },
  { value: 4, text: i18next.t('按规格自定义编码降序') }
]

@inject('editStore')
@observer
class TableDetailEditor extends React.Component {
  handleDataKeyChange = dataKey => {
    const { editStore } = this.props
    editStore.setPurchaseTableKey(dataKey)
  }

  handlePurchaseSettingKeyChange = dataKey => {
    const { editStore } = this.props

    editStore.setPurchasePrintSettingKey(dataKey)
  }

  // 切换明细行排序
  handleDetailSortKeyChange = dataKey => {
    const { editStore } = this.props
    editStore.setPurchaseDetailSortKey(dataKey)
  }

  handleDetailAddField = ({ key, value }) => {
    const { editStore, config } = this.props
    if (editStore.computedDataKey === 'purchase_detail_one_row') {
      // 序号 {{列.序号}}
      const transform = str => {
        return str
          .replace(/{{\s*([^}]+)\s*}}/g, '{{$1}}') // 先标准化（去掉多余空格）
          .replace(/{{([^.\s}]+)}}/g, '{{列.$1}}')
      }
      if (
        config.purchaseSettingKey === 'goods' &&
        config.dataKey !== 'purchase_independent_rol_sku'
      ) {
        editStore.setPurchaseTableKey('purchase_independent_rol_sku')
      } else if (
        config.purchaseSettingKey === 'merchant' &&
        config.dataKey !== 'purchase_independent_rol_address'
      ) {
        editStore.setPurchaseTableKey('purchase_independent_rol_address')
      }

      editStore.addFieldToTable({ key, value: transform(value) })

      return
    }
    editStore.specialTextAddField('*' + value)
  }

  handleSpecialTextChange = value => {
    const { editStore } = this.props
    editStore.setSpecialText(value)
  }

  handleSpecialStyleChange = value => {
    const { editStore } = this.props
    editStore.setSpecialStyle(value)
  }

  render() {
    const {
      addFields: { detailFields },
      editStore
    } = this.props
    const {
      purchaseSettingKey,
      // 明细行排序 key（老模板可能未定义，默认 0=DEFAULT）
      detail_sort_type = 0,
      specialConfig: { template_text, style }
    } = this.props.config

    return (
      <div>
        <Title title={i18next.t('设置采购明细')} />
        <Gap />
        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('采购明细')}：</div>
          <Select
            className='gm-printer-edit-select'
            value={editStore.computedDataKey}
            onChange={this.handleDataKeyChange}
          >
            {_.map(dataKeyList, v => (
              <Option key={v.value} value={v.value}>
                {v.text}
              </Option>
            ))}
          </Select>
        </Flex>

        {editStore.computedDataKey === 'purchase_detail_one_row' && (
          <>
            <Flex alignCenter className='gm-padding-top-5'>
              <div>{i18next.t('打印设置')}：</div>
              <Select
                className='gm-printer-edit-select'
                value={purchaseSettingKey}
                onChange={this.handlePurchaseSettingKeyChange}
              >
                {_.map(purchasePrintSettingDataKeyList, v => (
                  <Option key={v.value} value={v.value}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            </Flex>
            {/* 打印设置 tooltip：对所有商品和数据行整体排序 */}
            <TipInfo text={i18next.t('说明：对所有商品和数据行整体排序。')} />
            <TipInfo
              text={i18next.t(
                '  说明：该设置仅对采购任务导出/打印/分享有效！对采购单据无效。'
              )}
            />

            {/* 明细行排序：按商品排序时候选值为商户编码升降序，按商户排序时为规格编码升降序 */}

            <Flex alignCenter className='gm-padding-top-5'>
              <div>{i18next.t('明细行排序')}：</div>
              <Select
                className='gm-printer-edit-select'
                value={detail_sort_type}
                onChange={this.handleDetailSortKeyChange}
              >
                {_.map(
                  purchaseSettingKey === 'goods'
                    ? detailSortOptionsForGoods
                    : detailSortOptionsForMerchant,
                  v => (
                    <Option key={v.value} value={v.value}>
                      {v.text}
                    </Option>
                  )
                )}
              </Select>
            </Flex>
            {/* 明细行排序 tooltip：对单行商品或商户维度包含的多条明细行排序 */}
            <TipInfo
              text={i18next.t(
                '说明：对单行商品或商户维度包含的多条明细行排序。'
              )}
            />
          </>
        )}
        {editStore.computedDataKey !== 'purchase_no_detail' && (
          <>
            <div className='gm-padding-top-5'>
              <div>{i18next.t('添加字段')}：</div>
              <Flex wrap>
                {_.map(detailFields, o => (
                  <FieldBtn
                    key={o.key}
                    name={o.key}
                    onClick={this.handleDetailAddField.bind(this, o)}
                  />
                ))}
              </Flex>
            </div>

            {editStore.computedDataKey !== 'purchase_detail_one_row' && (
              <>
                <div className='gm-padding-top-5'>
                  <div>{i18next.t('字段设置')}：</div>
                  <Fonter
                    style={style}
                    onChange={this.handleSpecialStyleChange}
                  />
                  <Separator />
                  <TextAlign
                    style={style}
                    onChange={this.handleSpecialStyleChange}
                  />
                  <Gap />
                  <Textarea
                    onChange={this.handleSpecialTextChange}
                    value={template_text}
                    placeholder={i18next.t('请输入明细字段')}
                  />
                </div>
                <TipInfo
                  text={i18next.t(
                    '说明：在字段之间自行设置间隔符号,但谨慎修改{}中的内容,避免出现数据异常'
                  )}
                />
              </>
            )}
          </>
        )}
      </div>
    )
  }
}

TableDetailEditor.propTypes = {
  addFields: PropTypes.object.isRequired,
  editStore: PropTypes.object,
  config: PropTypes.object
}

@inject('editStore')
@observer
class EditorSpecialTable extends React.Component {
  render() {
    const { editStore } = this.props
    if (editStore.computedRegionIsTable) {
      const arr = editStore.selectedRegion.split('.')
      const tableConfig = editStore.config.contents[arr[2]]
      // 可以编辑明细的table
      if (tableConfig.specialConfig) {
        return (
          <TableDetailEditor
            config={tableConfig}
            addFields={this.props.addFields}
          />
        )
      } else {
        return null
      }
    }
    return null
  }
}

EditorSpecialTable.propTypes = {
  addFields: PropTypes.object.isRequired,
  editStore: PropTypes.object
}

export default EditorSpecialTable
