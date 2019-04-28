import i18next from '../../locales'
import React from 'react'
import { Flex, Option, Select } from '../components/index'
import { Gap, Title, FieldBtn, Textarea, TipInfo } from './component'
import _ from 'lodash'
import editStore from './store'
import { observer } from 'mobx-react'

const detailFields = [
  { key: i18next.t('分拣序号'), value: i18next.t('{{分拣序号}}') },
  { key: i18next.t('商户名'), value: i18next.t('{{商户名}}') },
  { key: i18next.t('采购数量(销售单位)'), value: i18next.t('{{采购数量_销售单位}}') },
  { key: i18next.t('采购数量(基本单位)'), value: i18next.t('{{采购数量_基本单位}}') },
  { key: i18next.t('商品备注'), value: i18next.t('{{商品备注}}') }
]

const dataKeyList = [
  { value: 'purchase_no_detail', text: i18next.t('不打印明细') },
  { value: 'purchase_last_col', text: i18next.t('单列-总表最后一列') },
  { value: 'purchase_one_row', text: i18next.t('单列-总表下方一行') },
  { value: 'purchase_flex_2', text: i18next.t('双栏-总表下方一行两栏') },
  { value: 'purchase_flex_4', text: i18next.t('四栏-总表下方一行四栏') }
]

@observer
class TableDetailEditor extends React.Component {
  handleDataKeyChange = dataKey => {
    editStore.setPurchaseTableKey(dataKey)
  }

  handleDetailAddField = (value) => {
    editStore.specialTextAddField('*' + value)
  }

  handleSpecialTextChange = value => {
    editStore.setSpecialText(value)
  }

  render () {
    const { dataKey, specialConfig } = this.props.tableConfig
    return (
      <div>
        <Title title={i18next.t('设置采购明细')}/>
        <Gap/>

        <Flex alignCenter className='gm-padding-top-5'>
          <div>{i18next.t('采购明细')}：</div>
          <Select className='gm-printer-edit-select' value={dataKey} onChange={this.handleDataKeyChange}>
            {_.map(dataKeyList, v => <Option key={v.value} value={v.value}>{v.text}</Option>)}
          </Select>
        </Flex>
        {dataKey !== 'purchase_no_detail' && <React.Fragment>
          <div className='gm-padding-top-5'>
            <div>{i18next.t('添加字段')}：</div>
            <Flex wrap>
              {_.map(detailFields, o => <FieldBtn key={o.key} name={o.key} onClick={this.handleDetailAddField.bind(this, o.value)}/>)}
            </Flex>
          </div>

          <div className='gm-padding-top-5'>
            <div>{i18next.t('字段设置')}：</div>
            <Textarea onChange={this.handleSpecialTextChange} value={specialConfig.template_text} placeholder={i18next.t('请输入明细字段')}/>
          </div>
          <TipInfo text={i18next.t('说明:在字段之间自行设置间隔符号,但请勿修改{}中的内容,避免出现数据异常')}/>
        </React.Fragment>}
      </div>
    )
  }
}

@observer
class EditorSpecialTable extends React.Component {
  render () {
    if (editStore.computedRegionIsTable) {
      const arr = editStore.selectedRegion.split('.')
      const tableConfig = editStore.config.contents[arr[2]]
      const hasSpecialDetailEditor = !!tableConfig.specialConfig
      // 可以编辑明细的table
      if (hasSpecialDetailEditor) {
        return <TableDetailEditor tableConfig={tableConfig}/>
      } else {
        return null
      }
    }
    return null
  }
}

export default EditorSpecialTable
