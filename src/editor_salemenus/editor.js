import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Flex } from '../components'
import { Gap, Title } from '../common/component'
import editStore from './store'
import { observer, inject } from 'mobx-react'
import EditorTitle from '../common/editor_title'
import EditorSelect from '../common/editor_select'
import EditorField from '../common/editor_edit_field'
import EditorAddField from '../common/editor_add_field'
import ContextMenu from './context_menu'
import i18next from '../../locales'
import withStore from '../common/hoc_with_store'

// ‼️‼️🚸🚸 注意: value的命名不要用下划线! 原因是 computedTableDataKeyOfSelectedRegion 会split('_')下划线做一些事情‼️
// 📚hasSubtotalBtn 这种表格是否支持  双栏,分类,合计  功能
const tableDataKeyList = [
  { value: 'orders', text: i18next.t('一行一个'), hasSubtotalBtn: false },
  { value: 'orders_multi', text: i18next.t('一行两个'), hasSubtotalBtn: false },
  {
    value: 'orders_multi3',
    text: i18next.t('一行三个'),
    hasSubtotalBtn: false
  },
  {
    value: 'orders_multi4',
    text: i18next.t('一行四个'),
    hasSubtotalBtn: false
  },
  { value: 'orders_multi5', text: i18next.t('一行五个'), hasSubtotalBtn: false }
]

export const hasSubtotalBtnTableDataKeySet = new Set(
  tableDataKeyList.filter(v => v.hasSubtotalBtn).map(o => o.value)
)

@withStore(editStore)
@inject('editStore')
@observer
class Editor extends React.Component {
  render() {
    const { onSave, showEditor, addFields, showNewDate } = this.props

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
            <EditorSelect />
            <Gap height='5px' />
            <EditorField
              tableDataKeyList={tableDataKeyList}
              showNewDate={showNewDate}
            />
            <Gap height='5px' />
            <EditorAddField addFields={addFields} />

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
  enablePageBorder: PropTypes.bool,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  showEditor: PropTypes.bool,
  mockData: PropTypes.object.isRequired,
  addFields: PropTypes.object.isRequired,
  showNewDate: PropTypes.bool
}

Editor.defaultProps = {
  enablePageBorder: false,
  onSave: _.noop,
  showNewDate: false
}

export default Editor
