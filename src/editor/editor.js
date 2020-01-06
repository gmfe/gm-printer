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

const tableDataKeyList = [
  { value: 'orders', text: i18next.t('全部商品') },
  { value: 'abnormal', text: i18next.t('异常商品') },
  { value: 'reward', text: i18next.t('积分表格') }
]

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
                  '说明：选中内容进行编辑，可拖动字段移动位置，右键使用更多功能，更多详情点击'
                )}
                <a
                  href='https://v.qq.com/x/page/t08044292dd.html'
                  target='_blank'
                  className='btn-link'
                  rel='noopener noreferrer'
                >
                  {i18next.t('查看视频教程')}
                </a>
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
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  showEditor: PropTypes.bool,
  mockData: PropTypes.object.isRequired,
  addFields: PropTypes.object.isRequired,
  showNewDate: PropTypes.bool
}

Editor.deaultProps = {
  onSave: _.noop,
  showNewDate: false
}

export default Editor
