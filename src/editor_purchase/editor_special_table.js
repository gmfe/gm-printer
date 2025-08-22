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

  handleDetailAddField = ({ key, value }) => {
    const { editStore, config } = this.props
    if (editStore.computedDataKey === 'purchase_detail_one_row') {
      // 序号 {{列.序号}}
      const transform = str => {
        return str
          .replace(/{{\s*([^}]+)\s*}}/g, '{{$1}}') // 先标准化（去掉多余空格）
          .replace(/{{([^.\s}]+)}}/g, '{{列.$1}}')
      }

      if (config.dataKey !== 'purchase_independent_rol_sku') {
        editStore.setPurchaseTableKey('purchase_independent_rol_sku')
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
            )}
            <TipInfo
              text={i18next.t(
                '说明：在字段之间自行设置间隔符号,但谨慎修改{}中的内容,避免出现数据异常'
              )}
            />
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
