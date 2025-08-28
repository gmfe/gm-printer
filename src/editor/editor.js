import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Flex, ToolTip } from '../components'
import { Gap, Title } from '../common/component'
import editStore from './store'
import { observer, inject } from 'mobx-react'
import EditorTitle from '../common/editor_title'
import EditorSelect from '../common/editor_select'
import SpecialField from '../common/editor_special_field'
import EditorField from '../common/editor_edit_field'
import EditorAddField from '../common/editor_add_field'
import EditorPageSummary from '../common/editor_page_summary'
import EditorCutomizedConfig from '../common/editor_customize_config'
import ContextMenu from './context_menu'
import i18next from '../../locales'
import withStore from '../common/hoc_with_store'

// ‼️‼️🚸🚸 注意: value的命名不要用下划线! 原因是 computedTableDataKeyOfSelectedRegion 会split('_')下划线做一些事情‼️
// 📚hasSubtotalBtn 这种表格是否支持  双栏,分类,合计  功能
const tableDataKeyList = [
  { value: 'orders', text: i18next.t('全部商品'), hasSubtotalBtn: true },
  { value: 'abnormal', text: i18next.t('异常商品'), hasSubtotalBtn: false },
  {
    value: 'abnormalDetails',
    text: i18next.t('异常商品(明细)'),
    hasSubtotalBtn: false
  },
  { value: 'reward', text: i18next.t('积分表格'), hasSubtotalBtn: false },
  { value: 'combination', text: i18next.t('组合商品'), hasSubtotalBtn: false },
  { value: 'turnover', text: i18next.t('周转物表格'), hasSubtotalBtn: false }
]

export const noSubtotalBtnTableDataKeySet = new Set(
  tableDataKeyList.filter(v => !v.hasSubtotalBtn).map(o => o.value)
)

@withStore(editStore)
@inject('editStore')
@observer
class Editor extends React.Component {
  render() {
    const {
      onSave,
      showEditor,
      addFields,
      showNewDate,
      mockData,
      mergeClassificationAndLabel
    } = this.props

    return (
      <div className='gm-printer-edit'>
        <Flex className='gm-printer-edit-title-fixed'>
          <Title
            title={i18next.t('模板预览')}
            text={
              <span className='gm-text-desc gm-padding-left-5'>
                {i18next.t(
                  '说明：选中内容进行编辑，可拖动字段移动位置，右键使用更多功能'
                )}
                {/* <a
                  href='https://v.qq.com/x/page/t08044292dd.html'
                  target='_blank'
                  className='btn-link'
                  rel='noopener noreferrer'
                >
                  {i18next.t('查看视频教程')}
                </a> */}
              </span>
            }
          />
        </Flex>

        {showEditor && (
          <div className='gm-printer-edit-zone'>
            <EditorTitle onSave={onSave} />
            <Gap height='10px' />
            <>
              <>{i18next.t('模版类型')}</>
              <ToolTip text='表示该模板是针对单一商户的配送单模板（商户配送单），或是账户合并打印配送单（账户配送单）的模板。' />
              <span>{':' + i18next.t('商户配送单')}</span>
            </>
            <Gap height='10px' />
            <EditorSelect />
            <Gap height='5px' />
            <SpecialField addFields={addFields} mockData={mockData} />
            <EditorCutomizedConfig />
            <Gap height='5px' />
            <EditorField
              tableDataKeyList={tableDataKeyList}
              showNewDate={showNewDate}
              mergeClassificationAndLabel={mergeClassificationAndLabel}
            />
            <Gap height='5px' />
            <EditorAddField addFields={addFields} />
            <Gap height='5px' />
            <EditorPageSummary summaryFields={addFields.summaryFields} />

            <div id='gm-printer-tip' />

            <div id='gm-printer-modal' />
          </div>
        )}

        <div className='gm-printer-edit-wrap'>
          <ContextMenu />
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  showEditor: PropTypes.bool,
  mockData: PropTypes.object.isRequired,
  addFields: PropTypes.object.isRequired,
  showNewDate: PropTypes.bool,
  mergeClassificationAndLabel: PropTypes.bool
}

Editor.defaultProps = {
  onSave: _.noop,
  showNewDate: false
}

export default Editor
